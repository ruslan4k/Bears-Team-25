const cors = require("cors");

const whitelist = ["http://localhost:3000", "http://3c73c4cf.ngrok.io/"];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false, credentials: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
