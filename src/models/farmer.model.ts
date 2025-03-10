import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../services/db.js";
import User from "../models/user.model.js";
import CommonFunctions from "./common-function.js";

interface FarmerAttributes {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  location?: string;
  digital_location?: string;
  farm_size?: number;
  created_at?: Date;
}

interface FarmerCreationAttributes extends Optional<FarmerAttributes, "id" | "location" | "digital_location" | "farm_size" | "created_at"> {}

class Farmer extends Model<FarmerAttributes, FarmerCreationAttributes> implements FarmerAttributes {
  public id!: number;
  public user_id!: number;
  public first_name!: string;
  public last_name!: string;
  public phone_number!: string;
  public location?: string;
  public digital_location?: string;
  public farm_size?: number;
  public readonly created_at!: Date;
}

Farmer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    digital_location: {
      type: DataTypes.STRING, // Can store GPS coordinates as a string (e.g., "5.6037,-0.1969")
      allowNull: true,
    },
    farm_size: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "farmers",
    timestamps: false,
  }
);

// Attach CommonFunctions
class FarmerModel extends CommonFunctions<Farmer> {
  constructor() {
    super(Farmer);
  }
}

// Define the relationship (1 User -> 1 Farmer)
User.hasOne(Farmer, { foreignKey: "user_id", as: "farmer" });
Farmer.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Farmer;
