const { UserData, Status, Menu, sequelize } = require("../config/database");

const adduser = async (phone_number) => {
  const results = await UserData.create({
    noHP: phone_number,
  });
  const { UserID } = results.dataValues;
  return UserID;
};

const addrecord = async (id_user, pilihan) => {
  try {
    const add = await Status.create({
      UserID: id_user,
      menu_id: pilihan,
    });
  } catch (err) {
    console.error(err);
  }
};
async function findUser(number_phone, choice) {
  try {
    const results = await UserData.findOne({
      where: {
        noHP: parseInt(number_phone),
      },
    });
    if (results) {
      const { UserID } = results.dataValues;
      addrecord(UserID, choice);
    } else {
      await adduser(number_phone)
        .then(async (UserID) => {
          await addrecord(UserID, choice);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  } catch (err) {
    console.error(err);
  }
}

//gambil data ke data base untuk genrate invoice
module.exports = { findUser };
