const { getAllstatus } = require("./model");

getAllstatus()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
