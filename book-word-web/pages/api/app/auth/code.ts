import type { NextApiRequest, NextApiResponse } from 'next';
import schema from '@/schema/app/code.json';
import Ajv from 'ajv';
import { redis } from '@/utils/redis';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

interface CodeReq {
  code: string;
}

interface CodeRes {
  userId: string;
  token: string;
  refreshToken: string;
}

const ajv = new Ajv();
const validate = ajv.compile(schema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST').json('Method Not Allowed');
    return;
  }

  try {
    const userId = req.headers['user-id'] as string;
    const body: CodeReq = JSON.parse(req.body);
    const valid = validate(body);
    if (!valid) {
      console.log(validate.errors);
      res.status(400).json({
        message: validate.errors!.map((item) => item.message).join(';'),
      });
      return;
    }

    const { code } = body;
    const codeInDb = await redis.get<string>(`app:code:${userId}`);
    if (codeInDb === null) {
      res.status(500).json({ message: '验证码已过期' });
      return;
    }
    if (code !== String(codeInDb)) {
      console.log(typeof code, typeof codeInDb, userId);

      res.status(500).json({ message: '验证码错误' });
      return;
    }
    // 验证成功
    const token = jwt.sign(
      {
        userId,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: 60 * 60 }
    );
    const refreshToken = nanoid();

    await redis.setex(
      `app:refreshToken:${userId}`,
      7 * 24 * 3600,
      refreshToken
    );
    await redis.del(`app:code:${userId}`);

    const resBody: CodeRes = {
      userId,
      token,
      refreshToken,
    };
    res.status(200).json(resBody);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
