import { WordModel } from '@/model/word-model';
import { ddbClient } from '@/utils/dynamodb';
import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

export const saveWord = async (word: WordModel) => {
  await ddbClient.send(
    new PutCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_WORD,
      Item: {
        Id: word.id,
        Word: word.word,
        Translation: word.translation,
        BookId: word.bookId,
        UserId: word.userId,
        CreateTime: word.createTime,
      },
    })
  );
};

export const searchWordsByUserIdAndBookId = async (
  userId: string,
  bookId: string
): Promise<WordModel[]> => {
  return await ddbClient
    .send(
      new QueryCommand({
        TableName: process.env.AWS_DYNAMODB_TABLE_WORD,
        KeyConditionExpression: '#userId = :userId And #bookId = :bookId',
        ExpressionAttributeNames: {
          '#userId': 'UserId',
          '#bookId': 'BookId',
        },
        ExpressionAttributeValues: {
          ':userId': userId,
          ':bookId': bookId,
        },
      })
    )
    .then((res) => res.Items ?? [])
    .then((list) => {
      return list.map((item) => ({
        id: item.Id,
        word: item.Word,
        translation: item.Translation,
        bookId: item.BookId,
        userId: item.UserId,
        createTime: item.CreateTime,
      }));
    });
};

export const deleteWord = async (wordId: string) => {
  await ddbClient.send(
    new DeleteCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_WORD,
      Key: {
        Id: wordId,
      },
    })
  );
};
