const { mintTokenUntilSuccess } = require("./mintToken");

const balance = parseInt(process.argv[2], 10);

if (isNaN(balance)) {
  console.error("The balance value must be a valid number.");
  process.exit(1);
}
mintTokenUntilSuccess(balance)
  .then((result) => {
    console.log("Minting succeeded. Final balance:", result);
  })
  .catch((error) => {
    console.error("Minting failed:", error);
  });
