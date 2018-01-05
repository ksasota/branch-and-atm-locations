const express = require('express');
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

const db = require("./helpers/database");

// db
let con = db.connect();
	con.then((data)=>{
	console.log("Database connected", data);
}).catch((error)=>{
	console.log("Database error", error);
});

app.use('/', routes);


app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});