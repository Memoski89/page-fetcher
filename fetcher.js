const request = require("request");
const fs = require("fs");
const url = process.argv[2];
const fileName = process.argv[3];
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

request(url, (error, response, body) => {
  if (error) {
    throw error;
  } else if (response && response.statusCode !== 200) {
    console.log("bad response code: ", response.statusCode);
    process.exit(1);
  } else {
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    fs.readFile(fileName, function(err) {
      if (err) {
        fs.writeFile(fileName, body, function(err) {
          let bytes = body.length * 2;
          if (err) throw err;
          console.log(`Downloaded and saved ${bytes} bytes to ${fileName}`);
        });
      } else {
        rl.question(
          "File already exists do you want to overwrite? y/n\n",
          (answer) => {
            if (answer === "y") {
              fs.writeFile(fileName, body, function(err) {
                let bytes = body.length * 2;
                if (err) throw err;
                console.log(
                  `Downloaded and saved ${bytes} bytes to ${fileName}`
                );
                rl.close();
              });
            } else if (answer === "n") {
              console.log("Take care");
              rl.close();
            }

            /* console.log(`Thank you for your valuable feedback: ${answer}`);
             */
            /* rl.close(); */
          }
        );
      }
    });
  }
});
