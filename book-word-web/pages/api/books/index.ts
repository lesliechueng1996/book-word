import type { NextApiRequest, NextApiResponse } from 'next';
import { ddbClient } from '@/utils/dynamodb';
import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import Ajv from 'ajv';
import schema from '@/schema/web/books.json';
import BookModel from '@/model/book-model';

const ajv = new Ajv();
const validate = ajv.compile(schema);

interface QueryBooksRes {
  nextCursor: string | null;
  data: BookModel[] | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).setHeader('Allow', 'GET').json('Method Not Allowed');
    return;
  }

  try {
    const query = req.query;
    const valid = validate(query);
    if (!valid) {
      console.log(validate.errors);
      res.status(400).json({
        message: validate.errors!.map((item) => item.message).join(';'),
      });
      return;
    }

    const { limit, nextCursor } = query;
    const scanCommandParam: ScanCommandInput = {
      TableName: process.env.AWS_DYNAMODB_TABLE_BOOK,
      Limit: Number(limit),
    };
    if (nextCursor) {
      scanCommandParam.ExclusiveStartKey = {
        Id: nextCursor,
      };
    }
    const response = await ddbClient.send(new ScanCommand(scanCommandParam));

    let data: QueryBooksRes['data'] = null;
    if (response.Items && response.Items.length > 0) {
      data = response.Items.map((item) => ({
        id: item.Id,
        name: item.Name,
        author: item.Author,
        url: item.Url,
        createTime: item.CreateTime,
      }));
    }

    const result: QueryBooksRes = {
      nextCursor: response.LastEvaluatedKey?.Id ?? null,
      data,
    };

    return res.status(200).json(result);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
}
