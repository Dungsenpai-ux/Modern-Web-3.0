# 🚀 HƯỚNG DẪN DEPLOY CONTRACTS

## Option 1: Deploy Local (Hardhat Network) - Khuyến nghị cho Development

### Bước 1: Mở terminal trong thư mục smart_contract
```bash
cd smart_contract
```

### Bước 2: Chạy local blockchain
```bash
npx hardhat node
```
☝️ Terminal này sẽ chạy blockchain local và show ra 20 test accounts với private keys

### Bước 3: Mở terminal MỚI và deploy contracts
```bash
cd smart_contract
npx hardhat run scripts/deployAll.js --network localhost
```

### Bước 4: Copy contract addresses
Sau khi deploy thành công, bạn sẽ thấy:
```
✅ Transactions deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✅ ModernToken deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✅ ModernNFT deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### Bước 5: Cập nhật file .ENV trong client/
Copy 3 địa chỉ vào:
```
VITE_TRANSACTIONS_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_MODERN_TOKEN_CONTRACT=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
VITE_MODERN_NFT_CONTRACT=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### Bước 6: Cấu hình MetaMask cho Local Network
1. Mở MetaMask
2. Add Network > Add Network Manually
3. Nhập thông tin:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
4. Import một test account từ hardhat node (dùng private key hiển thị trong terminal)

### Bước 7: Refresh trang web
```bash
# Trong terminal client/
npm run dev
```
Mở http://localhost:3000 và kết nối MetaMask!

---

## Option 2: Deploy lên Sepolia Testnet - Cho Production Testing

### ⚠️ YÊU CẦU:
- Sepolia ETH (get from faucet: https://sepoliafaucet.com/)
- Private key của ví có Sepolia ETH
- Infura hoặc Alchemy API key

### Bước 1: Tạo .env file trong smart_contract/
```bash
cd smart_contract
# Tạo file .env (KHÔNG commit file này!)
```

### Bước 2: Thêm vào .env
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_wallet_private_key_here
```

### Bước 3: Cập nhật hardhat.config.cjs
```javascript
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### Bước 4: Deploy lên Sepolia
```bash
npx hardhat run scripts/deployAll.js --network sepolia
```

### Bước 5: Copy addresses vào client/.env như Option 1

---

## 🔥 LƯU Ý QUAN TRỌNG:

1. **Local Network (localhost)**
   - ✅ Miễn phí, không cần testnet ETH
   - ✅ Deploy nhanh, reset được
   - ❌ Phải chạy `npx hardhat node` mỗi lần dev
   - ❌ Data mất khi tắt node

2. **Sepolia Testnet**
   - ✅ Data persistent, có thể share
   - ✅ Giống production hơn
   - ❌ Cần testnet ETH
   - ❌ Deploy chậm hơn (15-30s)

## 🎯 Khuyến nghị:
**Dùng Local Network** cho development, sau đó deploy lên **Sepolia** khi cần demo hoặc test integration thực tế!
