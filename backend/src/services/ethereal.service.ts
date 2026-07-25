import nodemailer from 'nodemailer';

export interface EtherealAccount {
  email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
}

export async function createEtherealAccount(): Promise<EtherealAccount> {
  const testAccount = await nodemailer.createTestAccount();
  return {
    email: testAccount.user,
    smtp_host: testAccount.smtp.host,
    smtp_port: testAccount.smtp.port,
    smtp_user: testAccount.user,
    smtp_pass: testAccount.pass,
  };
}

export function createTransport(account: EtherealAccount) {
  return nodemailer.createTransport({
    host: account.smtp_host,
    port: account.smtp_port,
    secure: account.smtp_port === 465,
    auth: {
      user: account.smtp_user,
      pass: account.smtp_pass,
    },
  });
}
