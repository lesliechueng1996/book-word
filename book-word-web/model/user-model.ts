export default interface UserModel {
  email: string;
  id: string;
  nickName: string;
  state: string;
  role: string;
  readingIds: string[];
  createTime: string;
  lastLoginTime?: string;
}
