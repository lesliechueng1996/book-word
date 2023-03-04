import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import { s3Client } from '@/utils/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { nanoid } from 'nanoid';
import { basename } from 'path';
import { ddbClient } from '@/utils/dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import dayjs from 'dayjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).setHeader('Allow', 'POST').json('Method Not Allowed');
    return;
  }

  try {
    const form = new IncomingForm();
    const uploadPromise = new Promise<File>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject();
          return;
        }
        resolve(files.file as File);
      });
    });
    const file = await uploadPromise;

    const bookId = nanoid();
    const bookName = file.originalFilename ?? basename(file.filepath);
    await s3Client.send(
      new PutObjectCommand({
        Body: createReadStream(file.filepath),
        Bucket: process.env.AWS_S3_BUCKET,
        Key: bookId,
        // Metadata: {
        //   name: bookName,
        // },
      })
    );

    await ddbClient.send(
      new PutCommand({
        TableName: process.env.AWS_DYNAMODB_TABLE_BOOK,
        Item: {
          Id: bookId,
          Name: bookName,
          Author: '',
          Url: `${process.env.AWS_S3_URL_PREFIX}${bookId}`,
          CreateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
      })
    );
    res.status(201).json('success');
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
