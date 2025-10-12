const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transactions", function () {
  it("Should add transaction to blockchain", async function () {
    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();
    await transactions.deployed();

    const [owner, addr1] = await ethers.getSigners();

    // Thêm giao dịch
    await transactions.addToBlockchain(
      addr1.address,
      ethers.utils.parseEther("0.01"),
      "Test message",
      "Test keyword"
    );

    // Kiểm tra số lượng giao dịch
    const count = await transactions.getTransactionCount();
    expect(count).to.equal(1);

    // Lấy danh sách giao dịch
    const allTransactions = await transactions.getAllTransactions();
    expect(allTransactions.length).to.equal(1);
    expect(allTransactions[0].message).to.equal("Test message");
    expect(allTransactions[0].keyword).to.equal("Test keyword");
  });

  it("Should return correct transaction count", async function () {
    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();
    await transactions.deployed();

    const [owner, addr1, addr2] = await ethers.getSigners();

    // Thêm nhiều giao dịch
    await transactions.addToBlockchain(
      addr1.address,
      ethers.utils.parseEther("0.01"),
      "Message 1",
      "Keyword 1"
    );

    await transactions.addToBlockchain(
      addr2.address,
      ethers.utils.parseEther("0.02"),
      "Message 2",
      "Keyword 2"
    );

    const count = await transactions.getTransactionCount();
    expect(count).to.equal(2);
  });

  it("Should emit Transfer event", async function () {
    const Transactions = await ethers.getContractFactory("Transactions");
    const transactions = await Transactions.deploy();
    await transactions.deployed();

    const [owner, addr1] = await ethers.getSigners();

    const tx = await transactions.addToBlockchain(
      addr1.address,
      ethers.utils.parseEther("0.01"),
      "Test message",
      "Test keyword"
    );

    const receipt = await tx.wait();
    const event = receipt.events?.find(e => e.event === "Transfer");

    expect(event).to.not.be.undefined;
    expect(event.args.from).to.equal(owner.address);
    expect(event.args.receiver).to.equal(addr1.address);
    expect(event.args.amount).to.equal(ethers.utils.parseEther("0.01"));
    expect(event.args.message).to.equal("Test message");
    expect(event.args.keyword).to.equal("Test keyword");
    expect(event.args.timestamp).to.be.a('number');
  });
});