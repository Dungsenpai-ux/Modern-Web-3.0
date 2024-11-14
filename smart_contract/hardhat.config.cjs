require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/F7YtPpS7pVebJttMOhXXLNKxZQqk6llo',
      accounts: ['3ab6a00fceb53adbb32a92770a9e71686be83f2f36cc7ba981b48395172e5826']
    }
  }
};