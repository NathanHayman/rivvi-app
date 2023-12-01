// ./scripts/createData.ts

import { getCliClient } from "sanity/cli";

const client = getCliClient();

async function createData() {
  console.log(`Create new data with:`);
  console.log(`Project ID: ${client.config().projectId}`);
  console.log(`Dataset: ${client.config().dataset}`);
}

createData();
