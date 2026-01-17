require('dotenv').config()
const db_host = process.env.DB_HOST;
const db_name = process.env.DB_NAME;
const PORT = process.env.PORT || 8080;
console.log(`Mongo host is ${db_host}.... ${process.env.DB_HOST}`);
const express = require("express");
const cors = require("cors");

const app = express();

console.log("DB_HOST in db.config =", process.env.DB_HOST);
var corsOptions = {
  origin: 'http://localhost:${PORT}'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: `Welcome to bezkoder application. ${db_host} and ${db_name}` });
  
});

app.get('/health', (req, res) => {
  // Устанавливаем статус 200 и отправляем JSON-ответ
  res.status(200).json({ status: 'ok'});
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
