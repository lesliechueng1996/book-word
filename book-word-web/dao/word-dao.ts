import { WordModel } from '@/model/word-model';
import { ddbClient } from '@/utils/dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

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
