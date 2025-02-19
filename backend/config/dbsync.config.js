import sequelize from "../db/connect.db.js";

const syncDB = async (options = { force: false, alter: true }) => {
  try {
    await sequelize.sync(options); // Sync all models globally
    console.log("Database synced successfully with options:", options);
  } catch (error) {
    console.error("Error syncing the database:", error);
  }
};

export default syncDB;
