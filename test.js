const dns = require("dns");

dns.lookup(
  "api.openai.com",
  (err, address) => {
    console.log("ERROR:", err);
    console.log("ADDRESS:", address);
  }
);