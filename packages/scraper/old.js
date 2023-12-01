const puppeteer = require("puppeteer-core");
const { parse } = require("node-html-parser");
const nlp = require("compromise");

function analyzeSitemap(sitemapArray) {
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

  return categorizedSitemap;
}

async function scrape() {
  let browser;
  const auth = "brd-customer-hl_6fb21ccc-zone-scraping_browser:br2xixe9jxf3";
  const url = "https://www.georgiakidney.com/${sitemap.php";

  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://${auth}@brd.superproxy.io:9222`,
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    await page.goto(url, { waitUntil: "networkidle0" });
    const content = await page.content();

    const root = parse(content);
    const sitemapItems = root.querySelectorAll(".sitemap li a");

    const sitemapArray = sitemapItems.map((item) => ({
      text: item.text,
      link: item.getAttribute("href"),
    }));
    const categorizedSitemap = analyzeSitemap(sitemapArray);
    console.log("Categorized Sitemap:", categorizedSitemap);
  } catch (e) {
    console.error("Scraping error:", e);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

scrape();
