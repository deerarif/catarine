// const { getAllstatus } = require("./model");

// getAllstatus()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
const Makeinvoice = require("./helpers/pdf");
const dafay = require("./helpers/data");

function Main() {
  try {
    Makeinvoice(dafay);
  } catch (err) {
    console.log(err);
  }
}
Main();
// console.log(data.QTY);
