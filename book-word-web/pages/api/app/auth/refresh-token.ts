import type { NextApiRequest, NextApiResponse } from 'next';
import schema from '@/schema/app/refresh-token.json';
import Ajv from 'ajv';
import { redis } from '@/utils/redis';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

interface RefreshTokenReq {
  refreshToken: string;
}

interface RefreshTokenRes {
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
    const body: RefreshTokenReq = req.body;
    const valid = validate(body);
    if (!valid) {
      console.log(validate.errors);
      res.status(400).json({
        message: validate.errors!.map((item) => item.message).join(';'),
      });
      return;
    }

    const { refreshToken } = body;
    const refreshTokenInDb = await redis.get(`app:refreshToken:${userId}`);
    if (!refreshTokenInDb) {
      res.status(401).json({ message: '登录信息已过期' });
      return;
    }

    if (refreshToken !== refreshTokenInDb) {
      res.status(401).json({ message: '刷新token失败' });
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
    const newRefreshToken = nanoid();

    await redis.setex(
      `app:refreshToken:${userId}`,
      7 * 24 * 3600,
      newRefreshToken
    );

    const resBody: RefreshTokenRes = {
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
