const { getData } = require("./model");

async function Meh(data) {
  try {
    const res = await getData(data);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}
Meh("HC25H88L");
