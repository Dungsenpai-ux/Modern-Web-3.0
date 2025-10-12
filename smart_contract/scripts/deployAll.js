const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying contracts...\n");

  // Deploy Transactions contract
  console.log("📝 Deploying Transactions contract...");
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();
  await transactions.deployed();
  console.log("✅ Transactions deployed to:", transactions.address);

  // Deploy ModernToken contract
  console.log("\n📝 Deploying ModernToken contract...");
  const ModernToken = await hre.ethers.getContractFactory("ModernToken");
  const modernToken = await ModernToken.deploy();
  await modernToken.deployed();
  console.log("✅ ModernToken deployed to:", modernToken.address);

  // Deploy ModernNFT contract
  console.log("\n📝 Deploying ModernNFT contract...");
  const ModernNFT = await hre.ethers.getContractFactory("ModernNFT");
  const modernNFT = await ModernNFT.deploy();
  await modernNFT.deployed();
  console.log("✅ ModernNFT deployed to:", modernNFT.address);

  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Transactions Contract:", transactions.address);
  console.log("ModernToken Contract:", modernToken.address);
  console.log("ModernNFT Contract:", modernNFT.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Save addresses to a file
  const fs = require("fs");
  const addresses = {
    Transactions: transactions.address,
    ModernToken: modernToken.address,
    ModernNFT: modernNFT.address,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "../client/src/utils/contractAddresses.json",
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n💾 Contract addresses saved to client/src/utils/contractAddresses.json");

  // Copy ABIs
  const transactionsArtifact = await hre.artifacts.readArtifact("Transactions");
  const tokenArtifact = await hre.artifacts.readArtifact("ModernToken");
  const nftArtifact = await hre.artifacts.readArtifact("ModernNFT");

  fs.writeFileSync(
    "../client/src/utils/TransactionsABI.json",
    JSON.stringify(transactionsArtifact.abi, null, 2)
  );

  fs.writeFileSync(
    "../client/src/utils/ModernTokenABI.json",
    JSON.stringify(tokenArtifact.abi, null, 2)
  );

  fs.writeFileSync(
    "../client/src/utils/ModernNFTABI.json",
    JSON.stringify(nftArtifact.abi, null, 2)
  );

  console.log("💾 ABIs saved to client/src/utils/\n");

  // Display some initial info
  const [owner] = await hre.ethers.getSigners();
  console.log("👤 Contract Owner:", owner.address);
  
  const tokenSupply = await modernToken.totalSupply();
  console.log("💰 ModernToken Initial Supply:", hre.ethers.utils.formatEther(tokenSupply), "MWT");
  
  const nftMintPrice = await modernNFT.mintPrice();
  console.log("🎨 NFT Mint Price:", hre.ethers.utils.formatEther(nftMintPrice), "ETH\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
