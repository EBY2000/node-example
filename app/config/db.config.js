
module.exports = {
  url: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || "bezkoder_db"}`
};
console.log("DB CONFIG URL =", module.exports.url);