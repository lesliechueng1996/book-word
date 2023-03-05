import UserModel from '@/model/user-model';
import { ddbClient } from '@/utils/dynamodb';
import { QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export const getUserByEmail = async (email: string) => {
  const result = await ddbClient.send(
    new QueryCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_USER,
      KeyConditionExpression: '#email = :email',
      ExpressionAttributeNames: {
        '#email': 'Email',
      },
      ExpressionAttributeValues: {
        ':email': email,
      },
    })
  );
  if (result.Items && result.Count && result.Count > 0) {
    const data = result.Items[0];
    return {
      email: data.Email,
      id: data.Id,
      nickName: data.NickName,
      state: data.State,
      role: data.Role,
      readingIds: JSON.parse(data.ReadingIds),
      createTime: data.CreateTime,
      lastLoginTime: data.LastLoginTime,
    };
  }
  return undefined;
};

export const saveUser = async (user: UserModel) => {
  await ddbClient.send(
    new PutCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_USER,
      Item: {
        Email: user.email,
        Id: user.id,
        NickName: user.nickName,
        State: user.state,
        Role: user.role,
        ReadingIds: JSON.stringify(user.readingIds),
        CreateTime: user.createTime,
        LastLoginTime: user.lastLoginTime,
      },
    })
  );
};

export const getUserById = async (userId: string) => {
  const result = await ddbClient.send(
    new QueryCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_USER,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: '#id = :userId',
      ExpressionAttributeNames: {
        '#id': 'Id',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
  );
  if (result.Items && result.Count && result.Count > 0) {
    const data = result.Items[0];
    return {
      email: data.Email,
      id: data.Id,
      nickName: data.NickName,
      state: data.State,
      role: data.Role,
      readingIds: JSON.parse(data.ReadingIds),
      createTime: data.CreateTime,
      lastLoginTime: data.LastLoginTime,
    };
  }
  return undefined;
};

export const updateUserReadingIds = async (user: UserModel) => {
  await ddbClient.send(
    new UpdateCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_USER,
      Key: {
        Email: user.email,
      },
      UpdateExpression: 'SET ReadingIds = :readingIds',
      ExpressionAttributeValues: {
        ':readingIds': JSON.stringify(user.readingIds),
      },
    })
  );
};
