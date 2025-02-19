import { DataTypes } from "sequelize";
import sequelize from "../db/connect.db.js";
import bcryptjs from "bcryptjs";

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: "Username is already taken. Please choose a different one.",
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: "Email is already registered.",
      },
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        console.log("Before saved called");
        if (user.changed("password")) {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
