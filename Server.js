require("dotenv").config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("./Home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  //   res.write("Welcome to the Server");
  //   res.end();
  if ((req.url = "/")) {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Chennai&appid={Your OpenWeatherMap API key}&units=metric"
    )
      .on("data", function (chunk) {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        res.end();

        // console.log("end");
      });
  } else {
    res.end("File not found");
  }
});

server.listen(8001, "127.0.0.1", () => {
  console.log(`Listening to the port 8001`);
});
