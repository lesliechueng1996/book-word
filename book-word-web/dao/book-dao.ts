import BookModel from '@/model/book-model';
import { ddbClient } from '@/utils/dynamodb';
import { ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';

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
  let index = 0;
  let expressionValue: { [key: string]: string } = {};
  ids.forEach((id) => {
    const key = `:id${index}`;
    expressionValue[key] = id;
  });
  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_BOOK,
      FilterExpression: `Id IN (${Object.keys(expressionValue).toString()})`,
      ExpressionAttributeValues: expressionValue,
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
