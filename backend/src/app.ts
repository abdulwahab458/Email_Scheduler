import express from 'express';
import cors from 'cors';
import { connectDatabase, sequelize } from './config/database';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import emailRoutes from './routes/email.routes';
import { errorMiddleware } from './middleware/error.middleware';
import User from './models/User';
import ScheduledEmail from './models/ScheduledEmail';
import Sender from './models/Sender';
import EmailLog from './models/EmailLog';
import { createEtherealAccount } from './services/ethereal.service';
import { startEmailWorker } from './jobs/email.worker';
import { recoverScheduledEmails } from './jobs/recover';
import morgan from 'morgan';


const MIN_SENDERS = 2;

async function ensureSenders() {
  const count = await Sender.count({ where: { is_active: true } });
  const toCreate = Math.max(0, MIN_SENDERS - count);
  for (let i = 0; i < toCreate; i += 1) {
    const account = await createEtherealAccount();
    await Sender.create({
      email: account.email,
      smtp_host: account.smtp_host,
      smtp_port: account.smtp_port,
      smtp_user: account.smtp_user,
      smtp_pass: account.smtp_pass,
      is_active: true,
    });
    console.log(`Created Ethereal sender: ${account.email}`);
  }
}

async function bootstrap() {
  User.hasMany(ScheduledEmail, { foreignKey: 'user_id' });
  ScheduledEmail.belongsTo(User, { foreignKey: 'user_id' });
  ScheduledEmail.hasMany(EmailLog, { foreignKey: 'scheduled_email_id' });
  EmailLog.belongsTo(ScheduledEmail, { foreignKey: 'scheduled_email_id' });
  Sender.hasMany(EmailLog, { foreignKey: 'sender_id' });
  EmailLog.belongsTo(Sender, { foreignKey: 'sender_id' });

  await connectDatabase();
  await sequelize.sync();

  await ensureSenders();
  const recovered = await recoverScheduledEmails();
  if (recovered > 0) {
    console.log(`Recovered ${recovered} scheduled email job(s)`);
  }

  startEmailWorker();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/emails', emailRoutes);

  app.use((_req, res) => {
    res.status(404).json({
      message: "Route not found",
    });
  });

  app.use(errorMiddleware);

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// async function startserver() {
//   try {
//     connectDatabase();
//     const app = express();
//     app.use(cors());
//     app.use(express.json({ limit: '2mb' }));
//     app.use(morgan('dev'));


//     app.get('/health', (_req, res) => {
//       res.json({ ok: true });
//     })

//     app.use("/api/test", testRoutes);
//     app.use('/api/auth', authRoutes);


//     app.listen(env.port, () => {
//       console.log(`API listening on http://localhost:${env.port}`);
//     });
//   }catch(error){
//     console.error("Failed to start application", error);
//     process.exit(1);
//   }
// }

// startserver()

