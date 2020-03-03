const request = require("request");
const { promisify } = require("util");

require("dotenv").config();

const promisifiedRequest = promisify(request);

const harryPotterData = async (character) => {
  let data = await promisifiedRequest({
    uri: `https://www.potterapi.com/v1/characters/?name=${character}&key=${process.env.key}`,
    // uri: `https://www.potterapi.com/v1/characters/5a0fa4daae5bc100213c232e/?key=${process.env.key}`,
    json: true,
  });

  return data.body;
};

const sortingHatData = async () => {
  let data = await promisifiedRequest({
    uri: `https://www.potterapi.com/v1/sortingHat`,
    json: true,
  })
  return data.body;
};

const houseData = async () => {
  let data = await promisifiedRequest({
    uri: `https://www.potterapi.com/v1/houses/?key=${process.env.key}`,
    // uri: `https://www.potterapi.com/v1/characters/5a0fa4daae5bc100213c232e/?key=${process.env.key}`,
    json: true,
  })
  return data.body;
};

const spellData = async (spells) => {
  let data = await promisifiedRequest({
    uri: `https://www.potterapi.com/v1/spells/?key=2a$10$dmigy61iSQ7pGje4i9TZHulKx3YrKnrzzKuyT0nivnb0LyZOK0/pW`,
    json: true,
  })
  return data.body;
}

module.exports = {
  harryPotterData,
  houseData,
  sortingHatData,
  spellData,
}