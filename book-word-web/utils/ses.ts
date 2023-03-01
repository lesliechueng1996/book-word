import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({});

export const sendEmail = async ({
  toAddress,
  subject,
  content,
}: {
  toAddress: string;
  subject: string;
  content: string;
}) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Data: content,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: process.env.EMAIL_FROM,
  });
  try {
    await client.send(command);
  } catch (e) {
    console.log(e);
    throw new Error(`Email(s) (${toAddress}) could not be sent`);
  }
};
