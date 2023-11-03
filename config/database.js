const { Sequelize, DataTypes, DATE, STRING } = require("sequelize");
require("dotenv").config();
// Create a Sequelize instance and specify the database connection details
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
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
    tableName: "UserData",
    timestamps: false,
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
    tableName: "Menu",
    timestamps: false,
  }
);
const Status = sequelize.define(
  "Status",
  {
    UserID: {
      type: DataTypes.INTEGER,
      references: {
        model: UserData,
        key: "UserID",
      },
    },
    menu_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Menu,
        key: "menu_id",
      },
    },
    Date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "Status",
    timestamps: false,
  }
);

const Dealer = sequelize.define(
  "DataDealer",
  {
    Kode_Dealer: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    Nama_Dealer: {
      type: DataTypes.STRING,
    },
    NoHP: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "DataDealer",
    timestamps: false,
  }
);

const Barang = sequelize.define(
  "Barang",
  {
    Kode_Barang: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: false,
      allowNull: false,
    },
    Nama_Barang: {
      type: DataTypes.STRING, // Use DataTypes.STRING instead of DataTypes.TEXT
    },
    Harga_Barang: {
      type: DataTypes.STRING, // Assuming Harga is a numeric value
    },
  },
  {
    tableName: "Barang",
    timestamps: false,
  }
);

const Stocks = sequelize.define(
  "Stock_Barang",
  {
    Kode_Barang: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    Stock_902: {
      type: DataTypes.TEXT,
    },
    Stock_900: {
      type: DataTypes.TEXT,
    },
    "STD DUS": {
      type: DataTypes.STRING,
    },
    Respon: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Stock_Barang",
    timestamps: false,
  }
);

const Orderan = sequelize.define(
  "Order",
  {
    Nomer_Orderan: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    Kode_Dealer: {
      type: DataTypes.STRING,
    },
    Material: {
      type: DataTypes.STRING,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Order",
    timestamps: false,
  }
);

Orderan.belongsTo(Barang, {
  foreignKey: "Material",
  targetKey: "Kode_Barang",
  as: "Barang", // You can use this alias when querying
});

// Association between Barang and Stock_Barang
Barang.hasOne(Stocks, {
  foreignKey: "Kode_Barang",
  sourceKey: "Kode_Barang",
  as: "Stock", // You can use this alias when querying
});

// Association between Order and DataDealer
Orderan.belongsTo(Dealer, {
  foreignKey: "Kode_Dealer",
  targetKey: "Kode_Dealer",
  as: "Dealer", // You can use this alias when querying
});
// Stocks.hasOne(Barang, { foreignKey: "Kode_Barang" });
// Dealer.hasMany(Orderan, { foreignKey: "Kode_Dealer" });
module.exports = { Stocks, UserData, Status, Menu, sequelize };
