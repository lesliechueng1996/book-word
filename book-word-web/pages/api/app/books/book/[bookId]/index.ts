import type { NextApiRequest, NextApiResponse } from 'next';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/utils/s3';
import { promisify } from 'util';
import stream from 'stream';

export const config = {
  api: {
    responseLimit: false,
  },
};

const pipeline = promisify(stream.pipeline);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { bookId } = req.query;

  try {
    const data = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: bookId as string,
      })
    );
    const content = await data.Body?.transformToByteArray();
    const contentStream = new stream.Duplex();
    contentStream.push(content);
    contentStream.push(null);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=dummy.pdf');
    await pipeline(contentStream, res);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
