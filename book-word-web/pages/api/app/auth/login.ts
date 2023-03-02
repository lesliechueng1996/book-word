import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail } from '@/dao/user-dao';
import { sendEmail } from '@/utils/ses';
import Ajv from 'ajv';
import schema from '@/schema/app/login.json';
import { redis } from '@/utils/redis';

interface LoginReq {
  email: string;
}

interface LoginRes {
  userId: string;
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
    const body: LoginReq = req.body;
    const valid = validate(body);
    if (!valid) {
      console.log(validate.errors);
      res.status(400).json({
        message: validate.errors!.map((item) => item.message).join(';'),
      });
      return;
    }

    const { email } = body;
    // 判断用户是否注册
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: '用户未注册' });
      return;
    }

    // 生成code
    const code = Date.now().toString().slice(-6);
    redis.setex(`app:code:${user.id}`, 600, code);

    await sendEmail({
      toAddress: email,
      subject: 'Sign in to Book-Word',
      content: html({ code: code, host: 'Book-Word' }),
    });
    const resBody: LoginRes = { userId: user.id };
    res.status(200).json(resBody);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}

function html(params: { code: string; host: string }) {
  const { code, host } = params;

  const escapedHost = host.replace(/\./g, '&#8203;.');

  const brandColor = '#f9f9f9';
  const color = {
    background: '#f9f9f9',
    text: '#000000',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: '#fff',
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
              <p>Code is <stong>${code}</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}
