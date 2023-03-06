import md5 from 'md5';

export const signature = (word: string, salt: string) => {
  const step1: string = `${process.env.BAIDU_APP_ID}${word}${salt}${process.env.BAIDU_APP_SECRET}`;
  const step2 = md5(step1);
  return step2.toLowerCase();
};
