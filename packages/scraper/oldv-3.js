// File: packages/scraper/index.js
const fs = require("fs");
const path = require("path");

// Replace this path with the location of your sitemap data JSON file
const SITEMAP_JSON_PATH = "./sitemap-data.json";
const GENERATED_DIR = path.join(__dirname, "generated");

// Read and parse the JSON data
const readSitemapData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    process.exit(1);
  }
};

// Use the provided labels to categorize sitemap items
const categorizeSitemapData = (sitemapItems) => {
  // Implement any label refinement if necessary
  // For now, we'll use the labels as they are provided
  return sitemapItems.map((item) => ({
    text: item.text,
    link: item.link,
    label: item.label.toLowerCase().replace(/_page$/, ""), // Example of label refinement
  }));
};

// Split the data into training and validation datasets
const splitData = (categorizedData, trainingRatio = 0.7) => {
  const cutoffIndex = Math.floor(categorizedData.length * trainingRatio);
  return {
    trainingData: categorizedData.slice(0, cutoffIndex),
    validationData: categorizedData.slice(cutoffIndex),
  };
};

// Save categorized data to .jsonl files
const saveDataToJsonl = (data, filename) => {
  const content = data.map((item) => JSON.stringify(item)).join("\n");
  fs.writeFileSync(path.join(GENERATED_DIR, filename), content, "utf-8");
};

// Ensure the directory for generated data exists
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

// Main function to process sitemap data and generate datasets
const generateDatasets = (jsonPath) => {
  const sitemapItems = readSitemapData(jsonPath);
  const categorizedData = categorizeSitemapData(sitemapItems);
  const { trainingData, validationData } = splitData(categorizedData);

  saveDataToJsonl(trainingData, "training_data.jsonl");
  saveDataToJsonl(validationData, "validation_data.jsonl");

  console.log("Training and validation datasets have been generated.");
};

// Run the main function with the path to your sitemap data JSON file
generateDatasets(SITEMAP_JSON_PATH);
