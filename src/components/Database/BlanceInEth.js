const fs = require("fs");
const { mintTokenUntilSuccess } = require("./mintToken");
fs.readFile("balanceInEther.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
    process.exit(1);
  }

  try {
    const balance = JSON.parse(data);
    //console.log("Parsed JSON data:", balance); // Log the parsed JSON for inspection

    // Continue with minting process
    mintTokenUntilSuccess(balance)
      .then((result) => {
        console.log("Minting succeeded. Final balance:", result);
      })
      .catch((error) => {
        console.error("Minting failed:", error);
      });
  } catch (parseError) {
    console.error("Error parsing JSON file:", parseError.message);
    process.exit(1);
  }
});