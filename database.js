const { Sequelize, DataTypes, DATE } = require("sequelize");

// Create a Sequelize instance and specify the database connection details
const sequelize = new Sequelize("catarine", "root", "satuduatiga", {
  host: "192.168.0.13", // Change this to your MySQL host
  dialect: "mysql",
});

// Define the "Stock" model that corresponds to the existing table
const Stock = sequelize.define(
  "Stock",
  {
    index: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true, // Define the primary key if necessary
    },
    Input: {
      type: DataTypes.TEXT,
    },
    Ket: {
      type: DataTypes.TEXT,
    },
    OH: {
      type: DataTypes.TEXT,
    },
    902: {
      type: DataTypes.TEXT,
    },
    900: {
      type: DataTypes.TEXT,
    },
    HET: {
      type: DataTypes.TEXT,
    },
    "STD DUS": {
      type: DataTypes.BIGINT,
    },
    Respon: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Stock", // Specify the table name that already exists
    timestamps: false, // Set this to false if the table doesn't have timestamp columns
  }
);
const UserData = sequelize.define(
  "UserData",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    noHP: {
      type: DataTypes.STRING(15),
    },
    Name: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "UserData", // Specify the table name that already exists
    timestamps: false, // Set this to false if the table doesn't have timestamp columns
  }
);
const Menu = sequelize.define(
  "Menu",
  {
    menu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    Nama: {
      type: DataTypes.STRING(50),
    },
    DetailMenu: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "Menu", // Specify the table name that already exists
    timestamps: false, // Set this to false if the table doesn't have timestamp columns
  }
);
const Status = sequelize.define(
  "Status",
  {
    // You may add additional fields if needed
    // Date: {
    //   type: Date,
    // },
  },
  {
    tableName: "Status",
    timestamps: false,
  }
);

// Define the associations for the many-to-many relationship
UserData.belongsToMany(Menu, { through: Status, foreignKey: "UserID" });
Menu.belongsToMany(UserData, { through: Status, foreignKey: "menu_id" });

// Export the Stock model to use it elsewhere in your application
module.exports = { Stock, UserData, Status, Menu, sequelize };
