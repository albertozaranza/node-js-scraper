const puppeteer = require("puppeteer");
var fs = require("fs");

const url = "http://www.supermercadopinheiro.com.br/cinemas/cinema-aracati";

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const films = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".box-item")).map(compact => ({
      room: compact.querySelector("h4").textContent,
      title: compact.querySelector("h3").textContent,
      others: Array.from(compact.querySelectorAll("span")).map(
        (item, index) => {
          switch (index) {
            case 0:
              return { schedule: item.textContent };
            case 1:
              return { genre: item.textContent };
            case 2:
              return { censorship: item.textContent };
            case 3:
              return { duration: item.textContent };
            default:
              return;
          }
        }
      ),
      synopsis: Array.from(compact.querySelectorAll(".span12 > p")).map(
        (item, index) => {
          switch (index) {
            case 0:
              return;
            case 1:
              return { text: item.textContent };
            case 2:
              return;
            default:
              return;
          }
        }
      ),
      image: compact.querySelector("img").src,
      video: compact.querySelector("a > iframe").src
    }))
  );

  var objects = {
    films: []
  };

  films.map(film => {
    objects.films.push(film);
  });

  var jsonContent = JSON.stringify(objects);

  fs.writeFile("output.json", jsonContent, "utf8", function(err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });

  await browser.close();
};

module.exports = scrape;
