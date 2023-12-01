const fs = require("fs");
const puppeteer = require("puppeteer-core"); // Ensure 'puppeteer' if not using 'puppeteer-core'
const { parse } = require("node-html-parser");
const nlp = require("compromise");
const URLS_TXT_FILE = "./urls.txt"; // Ensure this is the correct path to your TXT file

// Insert an artificial delay between operations
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to load URLs from a TXT file
async function readUrlsFromFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    console.log("URLs read from file");
    return data.split("\n").filter((line) => line);
  } catch (error) {
    console.error("Error reading from file:", error);
    throw error; // Propagate error
  }
}

// Function to scrape a sitemap page
async function scrapeSitemap(url, delayTime) {
  console.log(`Scraping: ${url}`);
  let browser;
  const auth = "brd-customer-hl_6fb21ccc-zone-scraping_browser:br2xixe9jxf3";
  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto(`${url}/sitemap.php`, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    // if the page is not found, return an empty array
    if (page.url().includes("404")) {
      return [];
    }
    const content = await page.content();
    const root = parse(content);
    const sitemapItems = root.querySelectorAll(".sitemap li a");
    return sitemapItems.map((item) => ({
      text: item.text.trim(),
      link: item.getAttribute("href").trim(),
    }));
  } catch (error) {
    console.error("Scraping error:", error);
    return []; // Return an empty array on error
  } finally {
    if (browser) {
      await browser.close();
    }
    await delay(delayTime); // Delay after closing browser
  }
}

function categorizeSitemapData(sitemapArray) {
  // Implement your categorization logic here
  const patterns = {
    home: /^Welcome to|Home$/,
    about: /^About( Us)?|Who We Are|Our Story|Profile$/,
    contact: /^Contact( Us)?$/,
    members:
      /^Providers|Our Doctors|Nurse Practitioners|Nephrologists|Doctors|Staff|Team|MD|FACP|PhD|ANP-BC|ACNP-BC$/,
    services:
      /^Services|Medical Services|Patient Services|Treatments|Conditions|Specialties|Care$/,
    locations:
      /^Locations|Offices|Practices|Clinics|Hospitals|Office|Suite|Building|Center|Hospital|Clinic|Practice|Facility|Address|Directions|Map|Phone|Fax|Hours|Hours of Operation|Hour$/,
    patientCenter: /^Patient (Center|Information|Resources|Services)$/,
    careers: /^Careers|Jobs|Employment|Opportunities$/,
  };
  // This is an example based on patterns, replace with your actual logic
  const categorizedSitemap = {
    home: [],
    about: [],
    contact: [],
    members: [],
    services: [],
    locations: [],
    patientCenter: [],
    careers: [],
    other: [],
  };

  sitemapArray.forEach((item) => {
    const cleanText = item.text.trim().replace(/\n/g, " ");
    let isCategorized = false;

    // First pass with regular expressions
    Object.keys(patterns).forEach((category) => {
      if (!isCategorized && patterns[category].test(cleanText)) {
        categorizedSitemap[category].push(item);
        isCategorized = true;
      }
    });

    // For 'other', let's use nlp for additional context
    if (!isCategorized) {
      categorizedSitemap.other.push(item);
    }
  });

  // Further process items in 'other' using NLP for potential re-categorization
  const nlpCategorized = {
    locations: [],
    other: [],
  };

  categorizedSitemap.other.forEach((item) => {
    // Check for location-related words using compromise
    const doc = nlp(item.text);
    if (doc.has("office|suite|building|hospital|clinic|center")) {
      nlpCategorized.locations.push(item);
    } else {
      nlpCategorized.other.push(item);
    }
  });

  // Reassign the refined categories back into the main categorizedSitemap
  categorizedSitemap.locations.push(...nlpCategorized.locations);
  categorizedSitemap.other = nlpCategorized.other;
  return Object.values(categorizedSitemap).flat();
}

async function generateDatasets(urlsFilePath) {
  const urls = await readUrlsFromFile(urlsFilePath);
  const categorizedData = [];

  for (const url of urls) {
    const sitemapItems = await scrapeSitemap(url, 500); // 1-second delay
    categorizedData.push(...categorizeSitemapData(sitemapItems));
  }

  // Save to `generated` folder with training and validation files
  fs.writeFileSync(
    "training_data.jsonl",
    JSON.stringify(categorizedData, null, 2),
  );
  console.log("Training data has been written.");
}

generateDatasets(URLS_TXT_FILE)
  .then(() => console.log("Dataset generation complete!"))
  .catch((error) =>
    console.error("An error occurred in the dataset generation:", error),
  );
