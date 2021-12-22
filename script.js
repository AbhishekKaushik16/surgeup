const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("data.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    csvData.shift();

    const pool = new Pool({
      host: "localhost",
      user: "postgres",
      database: "surgeup",
      password: "postgres",
      port: 5432
    });

    const query =
      "INSERT INTO covid (state, fips, cases, deaths) VALUES ($1, $2, $3, $4)";

    pool.connect((err, client, done) => {
      if (err) throw err;

      data = {};

      try {
        csvData.forEach(row => {
            if(row[1] in data) {
                data[row[1]].cases += parseInt(row[3]);
                data[row[1]].deaths += parseInt(row[4]);
            }else {
                data[row[1]] = {
                    fips: row[2],
                    cases: parseInt(row[3]),
                    deaths: parseInt(row[4])
                }
            }
        });
        for(var k in data) {
          client.query(query, [k, data[k]["fips"], data[k]["cases"], data[k]["deaths"]], (err, res) => {
              if (err) {
                console.log(err.stack);
              }
            });
        }
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);
