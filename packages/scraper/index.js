// File: index.js
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const axios = require("axios");
const cheerio = require("cheerio");

const trainingDataPath = path.join(__dirname, "demo", "training-data.jsonl");
const modelPath = path.join(__dirname, "demo", "ml_model.joblib");
const URLsFilePath = path.join(__dirname, "urls.txt");
const pythonScriptPath = "train_and_classify.py";

function scrapeWebsite(url) {
  return axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      return $(".sitemap li a")
        .map((i, el) => ({
          text: $(el).text().trim(),
          link: $(el).attr("href").trim(),
        }))
        .get()
        .filter((item) => item.text && item.link);
    })
    .catch(console.error);
}

function scrapeSites(urlsFilePath) {
  const urls = fs.readFileSync(urlsFilePath, "utf8").split("\n");
  return Promise.all(urls.map(scrapeWebsite)).then((results) => {
    return results.flat();
  });
}

function runPythonScript(script, args) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [script, ...args]);

    pythonProcess.stdout.on("data", (data) => console.log(data.toString()));
    pythonProcess.stderr.on("data", (data) => console.error(data.toString()));

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Python script ${script} exited with code ${code}`));
      }
    });
  });
}

async function main() {
  // Step 1: Train the ML model based on the training data
  await runPythonScript(pythonScriptPath, [
    "train",
    trainingDataPath,
    modelPath,
  ]);

  // Step 2: Scrape websites from the provided URLs
  const scrapedData = await scrapeSites(URLsFilePath);
  const scrapedDataPath = path.join(__dirname, "demo", "scraped-data.jsonl");
  fs.writeFileSync(scrapedDataPath, JSON.stringify(scrapedData, null, 2));

  // Step 3: Classify the scraped data using the trained ML model
  await runPythonScript(pythonScriptPath, [
    "classify",
    modelPath,
    scrapedDataPath,
    scrapedDataPath,
  ]);
}

main().catch((err) => console.error(err));
