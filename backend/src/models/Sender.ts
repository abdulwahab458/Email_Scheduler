import {
  DataTypes,
  Model,
  Optional,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../config/database';

export interface SenderAttributes {
  id: string;
  email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  is_active: boolean;
}



export class Sender
  extends Model<InferAttributes<Sender>, InferCreationAttributes<Sender>>
  implements SenderAttributes
{
  declare id: CreationOptional<string>;
  declare email: string;
  declare smtp_host: string;
  declare smtp_port: number;
  declare smtp_user: string;
  declare smtp_pass: string;
  declare is_active: CreationOptional<boolean>;
}

Sender.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
    }
    },
    smtp_host: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
    }
    },
    smtp_port: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    smtp_user: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
    }
    },
    smtp_pass: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
    }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'senders',
    timestamps: false,
    underscored: true,
  }
);

export default Sender;
