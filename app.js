const express = require("express");
const app = express();
const cors = require("cors"); // Make API calls to the backend
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const dbService = require("./server/dbService");

app.use(cors()); // Don't incoming API calls, but instead send data to our backend
app.use(express.json()); // Send it in JSON format
app.use(express.urlencoded({ extended: false }));

app.use("/client", express.static(__dirname + "/client"));

app.use("/server", express.static(__dirname + "/server"));

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

PORT = 3000;

app.get("/", (request, response) => {
  // Sends http response to client page
  response.sendFile(__dirname + "/client/start.html");
});

app.get("/license", (request, response) => {
  // Sends http response to client page
  response.sendFile(__dirname + "/client/license.html");
});

// Used when you want to create new data

// create
app.post("/insert", (request, response) => {
  const { name } = request.body; // Name textbox
  const db = dbService.getDbServiceInstance();

  const result = db.insertNewName(name);

  console.log("app.post:" + name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// read
app.get("/getAll", (request, response) => {
  // get the dbService object
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();

  result
    .then((data) => {
      // Log the data fetched from database
      console.log("Data fetched from database:", data);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      response
        .status(500)
        .json({ error: "An error occured while fetching data" });
    });
});

// update
app.patch("/update", (request, response) => {
  const { id } = request.body;
  const { name } = request.body;
  console.log("app.patch: /update", +id + name);
  const db = dbService.getDbServiceInstance();

  const result = db.updateNameById(id, name);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

// delete
app.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

app.get("/search/:name", (request, response) => {
  const { name } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.searchByName(name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.listen(`${PORT}`, () => {
  console.log(`License Tracker running at port: ${PORT}`);
});
