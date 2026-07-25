import {
  DataTypes,
  Model,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { ScheduledEmailStatus } from '../types';

export interface ScheduledEmailAttributes {
  id: string;
  user_id: string;
  sender_email: string;
  recipient_email: string;
  subject: string;
  body: string;
  scheduled_at: Date;
  status: ScheduledEmailStatus;
  sent_at: Date | null;
  error_message: string | null;
  idempotency_key: string;
  batch_id: string;
  created_at?: Date;
}


export class ScheduledEmail
  extends Model<InferAttributes<ScheduledEmail>, InferCreationAttributes<ScheduledEmail>>
  implements ScheduledEmailAttributes
{
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare sender_email: string;
  declare recipient_email: string;
  declare subject: string;
  declare body: string;
  declare scheduled_at: Date;
  declare status: CreationOptional<ScheduledEmailStatus>;
  declare sent_at: Date | null;
  declare error_message: string | null;
  declare idempotency_key: string;
  declare batch_id: string;
  declare created_at: CreationOptional<Date>;
}

ScheduledEmail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    recipient_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
    }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'queued', 'sent', 'failed'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idempotency_key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    batch_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'scheduled_emails',
    timestamps: false,
    underscored: true,
  }
);

export default ScheduledEmail;
