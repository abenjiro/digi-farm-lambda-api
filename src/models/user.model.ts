import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../services/db.js";
import CommonFunctions from "./common-function.js";

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  email: string;
  created_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "created_at"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public readonly created_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

// Attach CommonFunctions
class UserModel extends CommonFunctions<User> {
  constructor() {
    super(User);
  }
}


export default User;
