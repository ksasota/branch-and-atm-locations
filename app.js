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

// Error Handling...
app.use((req,res,next) => {
	const err = new Error('Not found.');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		errors: {
			message: err.message,
			code: err.status
		}
	})
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});