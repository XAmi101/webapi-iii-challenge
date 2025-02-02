const express = require('express');

const server = express();
server.use(express.json());


const userRouter = require("./users/userRouter");



//custom middleware
function logger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} to ${req.url}`);
  next();
}
server.use(logger);
server.use("/api/users", userRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});




function logger(req, res, next) {

};

module.exports = server;
 