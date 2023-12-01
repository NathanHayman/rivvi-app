// File: packages/scraper/index.js
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const use = require("@tensorflow-models/universal-sentence-encoder");

const SITEMAP_JSON_PATH = path.join(__dirname, "./sitemap-data.json");
const GENERATED_DIR = path.join(__dirname, "./generated");
const URLS_FILE_PATH = path.join(__dirname, "./urls.txt");

// Read and parse the JSON data
const readJsonData = (filePath) => {
  console.log("Reading and parsing JSON data...");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Scrape website content
const scrapeWebsite = async (url) => {
  console.log("Scraping website content...");
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const titles = $("h1")
      .map((i, el) => $(el).text().trim())
      .get();
    const images = $("img")
      .map((i, el) => $(el).attr("src"))
      .get();
    // Extract other fields if needed
    return { url, titles, images };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
};

// Process text data with AI/NLP
const processTextWithAI = async (textData) => {
  console.log("Processing text data with AI...");
  const model = await use.load();
  const sentences = textData.titles; // Assuming you're processing titles
  const embeddings = await model.embed(sentences);
  // Here we are just returning the embedding as an array to simulate processing.
  // Replace with your own logic for categorization or further NLP processing.
  return embeddings.arraySync();
};

// Scrape URLs from a file and return an array of scraped data
const scrapeUrlsFromFile = async (filePath) => {
  console.log("Scraping URLs from file...");
  const urls = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
  return await Promise.all(urls.map(scrapeWebsite));
};

// Categorize sitemap data
const categorizeSitemapData = (sitemapItems) => {
  console.log("Categorizing sitemap data...");
  return sitemapItems.map((item) => ({
    text: item.text,
    link: item.link,
    label: item.label.toLowerCase().replace(/_page$/, ""),
  }));
};

// Split data into training and validation datasets
const splitData = (categorizedData, trainingRatio = 0.7) => {
  console.log("Splitting data into training and validation datasets...");
  const cutoffIndex = Math.floor(categorizedData.length * trainingRatio);
  return {
    trainingData: categorizedData.slice(0, cutoffIndex),
    validationData: categorizedData.slice(cutoffIndex),
  };
};

// Save categorized data to .jsonl files
const saveDataToJsonl = (data, filename) => {
  console.log("Saving categorized data to .jsonl files...");
  const content = data.map((item) => JSON.stringify(item)).join("\n");
  fs.writeFileSync(path.join(GENERATED_DIR, filename), content, "utf-8");
};

// Main function
const main = async () => {
  // Ensure the directory for generated data exists
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }

  const scrapedData = await scrapeUrlsFromFile(URLS_FILE_PATH);
  const sitemapData = readJsonData(SITEMAP_JSON_PATH);
  // Combine and process scraped data with sitemap data here
  // For this example, assume they are concatenated
  const combinedData = [...sitemapData, ...scrapedData];
  const processedData = await Promise.all(combinedData.map(processTextWithAI));

  // Proceed with the existing labels and combination logic
  const categorizedData = categorizeSitemapData(processedData);
  const { trainingData, validationData } = splitData(categorizedData);

  saveDataToJsonl(trainingData, "training_data01.jsonl");
  saveDataToJsonl(validationData, "validation_data01.jsonl");

  console.log("Training and validation datasets have been generated.");
};

main(); // Run the main function
