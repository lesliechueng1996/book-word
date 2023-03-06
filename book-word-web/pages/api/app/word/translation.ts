import { nanoid } from 'nanoid';
import type { NextApiRequest, NextApiResponse } from 'next';
import { signature } from '@/utils/baidu-translate';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET').json('Method Not Allowed');
    return;
  }

  const { word } = req.query;
  if (!word) {
    res.status(400).json({ message: '缺少单词' });
    return;
  }

  try {
    const salt = nanoid();
    const sign = signature(word as string, salt);
    const url = `${process.env.BAIDU_TRANSLATE_URL}?q=${encodeURIComponent(
      word as string
    )}&from=en&to=zh&appid=${
      process.env.BAIDU_APP_ID
    }&salt=${salt}&sign=${sign}`;
    const response = await fetch(url);
    const body = await response.json();
    if (body['error_code']) {
      console.log(body);
      res.status(500).json({ message: body['error_msg'] });
      return;
    }

    const dst = body['trans_result'].map((item: any) => item.dst);
    res.status(200).json({ dst });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
