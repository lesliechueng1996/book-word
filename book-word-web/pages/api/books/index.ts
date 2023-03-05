import type { NextApiRequest, NextApiResponse } from 'next';
import Ajv from 'ajv';
import schema from '@/schema/web/books.json';
import BookModel from '@/model/book-model';
import { listBooks } from '@/dao/book-dao';

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
    const { data, response } = await listBooks(
      Number(limit),
      nextCursor as string
    );

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
