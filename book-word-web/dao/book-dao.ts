import BookModel from '@/model/book-model';
import { ddbClient } from '@/utils/dynamodb';
import {
  QueryCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';

export const listBooks = async (limit: number, nextCursor?: string) => {
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

  let data: BookModel[] | null = null;
  if (response.Items && response.Items.length > 0) {
    data = response.Items.map((item) => ({
      id: item.Id,
      name: item.Name,
      author: item.Author,
      url: item.Url,
      createTime: item.CreateTime,
    }));
  }

  return {
    data,
    response,
  };
};

export const getBooksByIds = async (ids: string[]) => {
  if (!ids || ids.length === 0) {
    return [];
  }
  const result = await ddbClient.send(
    new QueryCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_BOOK,
      KeyConditionExpression: '#id in :bookdIds',
      ExpressionAttributeNames: {
        '#id': 'Id',
      },
      ExpressionAttributeValues: {
        ':bookdIds': ids,
      },
    })
  );

  if (result.Items && result.Count && result.Count > 0) {
    return result.Items.map((item) => ({
      id: item.Id,
      name: item.Name,
      author: item.Author,
      url: item.Url,
      createTime: item.CreateTime,
    }));
  }
  return undefined;
};
