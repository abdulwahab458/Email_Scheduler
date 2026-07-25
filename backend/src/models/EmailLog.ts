import {
  DataTypes,
  Model,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { EmailLogStatus } from '../types';

export interface EmailLogAttributes {
  id: string;
  scheduled_email_id: string;
  sender_id: string;
  status: EmailLogStatus;
  sent_at: Date;
  response: Record<string, unknown> | null;
  error: string | null;
}

type EmailLogCreation = Optional<EmailLogAttributes, 'id' | 'response' | 'error'>;

export class EmailLog
  extends Model<InferAttributes<EmailLog>, InferCreationAttributes<EmailLog>>
  implements EmailLogAttributes
{
  declare id: CreationOptional<string>;
  declare scheduled_email_id: string;
  declare sender_id: string;
  declare status: EmailLogStatus;
  declare sent_at: Date;
  declare response: Record<string, unknown> | null;
  declare error: string | null;
}

EmailLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    scheduled_email_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('sent', 'failed'),
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    response: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'email_log',
    timestamps: false,
    underscored: true,
  }
);

export default EmailLog;
