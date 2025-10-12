# 🚀 Hướng Dẫn Chạy Dự Án Modern Web 3.0

## 📋 Yêu Cầu Hệ Thống

### Cài Đặt Trước:
- ✅ **Node.js** (v16 trở lên): [Download](https://nodejs.org/)
- ✅ **npm** hoặc **yarn**: Đi kèm với Node.js
- ✅ **MetaMask**: Extension trên browser [Download](https://metamask.io/)
- ✅ **Git**: [Download](https://git-scm.com/)

### Kiểm Tra:
```bash
node --version    # v16.x.x hoặc cao hơn
npm --version     # 8.x.x hoặc cao hơn
```

---

## 🔧 Cài Đặt Dự Án

### Bước 1: Clone Repository (nếu chưa có)
```bash
git clone https://github.com/Dungsenpai-ux/Modern-Web-3.0.git
cd Modern-Web-3.0
```

### Bước 2: Cài Đặt Dependencies

#### **Smart Contract:**
```bash
cd smart_contract
npm install
```

#### **Frontend:**
```bash
cd ../client
npm install
```

---

## 🏃 Chạy Dự Án

### **Phương Án 1: Development với Local Blockchain**

#### Terminal 1 - Chạy Hardhat Local Node:
```bash
cd smart_contract
npx hardhat node
```
**Kết quả:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```
**⚠️ Giữ terminal này chạy!**

#### Terminal 2 - Deploy Smart Contracts:
```bash
cd smart_contract
npx hardhat run scripts/deployAll.js --network localhost
```
**Kết quả:**
```
🚀 Deploying contracts...
✅ Transactions deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✅ ModernToken deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✅ ModernNFT deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
💾 Contract addresses saved to client/src/utils/contractAddresses.json
```

**📝 Lưu lại các địa chỉ này!**

#### Terminal 3 - Chạy Frontend:
```bash
cd client
npm run dev
```
hoặc
```bash
npm start
```

**Kết quả:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

#### Bước 4 - Kết Nối MetaMask:

1. **Mở MetaMask**
2. **Thêm Local Network:**
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

3. **Import Test Account:**
   - Click "Import Account"
   - Dán Private Key từ Terminal 1
   - Ví dụ: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

4. **Truy cập ứng dụng:**
   - Mở browser: `http://localhost:5173`
   - Click "Connect Wallet"
   - Approve trong MetaMask

---

### **Phương Án 2: Deploy lên Sepolia Testnet**

#### Bước 1 - Lấy Sepolia ETH (Test ETH):
1. Truy cập: [Sepolia Faucet](https://sepoliafaucet.com/)
2. Nhập địa chỉ MetaMask
3. Nhận 0.5 ETH test

#### Bước 2 - Cấu Hình Hardhat (đã có sẵn):
File `hardhat.config.cjs` đã có config Sepolia:
```javascript
networks: {
  sepolia: {
    url: 'https://eth-sepolia.g.alchemy.com/v2/...',
    accounts: ['YOUR_PRIVATE_KEY']
  }
}
```

**⚠️ Cảnh báo:** Không commit private key thật lên GitHub!

#### Bước 3 - Deploy lên Sepolia:
```bash
cd smart_contract
npx hardhat run scripts/deployAll.js --network sepolia
```

#### Bước 4 - Update Frontend Config:
Cập nhật file `client/src/utils/constants.js` với địa chỉ contracts mới.

#### Bước 5 - Chạy Frontend:
```bash
cd client
npm run dev
```

#### Bước 6 - Kết nối MetaMask với Sepolia:
1. Chọn network "Sepolia" trong MetaMask
2. Truy cập `http://localhost:5173`
3. Connect wallet

---

## 🎯 Cấu Trúc Chạy

```
┌─────────────────────────────────────────────────────────┐
│                    DEVELOPMENT SETUP                     │
└─────────────────────────────────────────────────────────┘

Terminal 1              Terminal 2              Terminal 3
──────────             ──────────              ──────────
Hardhat Node    →      Deploy Contracts  →     Frontend
(Blockchain)           (Smart Contracts)       (React App)
    │                       │                      │
    │                       │                      │
    ↓                       ↓                      ↓
Port 8545              Save ABIs & Address    Port 5173
Local ETH Network      to client/src/utils    Browser UI
```

---

## 📁 File Quan Trọng

### Smart Contract:
- `contracts/Transactions.sol` - Main contract
- `contracts/ModernToken.sol` - ERC-20 token
- `contracts/ModernNFT.sol` - ERC-721 NFT
- `scripts/deployAll.js` - Deploy script
- `hardhat.config.cjs` - Hardhat config

### Frontend:
- `src/context/TransactionContext.jsx` - Blockchain logic
- `src/utils/constants.js` - Contract addresses & ABIs
- `src/utils/ipfs.js` - IPFS functions
- `src/components/` - UI components

---

## 🐛 Troubleshooting

### Issue 1: Port đã được sử dụng
**Lỗi:** `Port 8545 already in use`
**Giải pháp:**
```bash
# Windows
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8545 | xargs kill -9
```

### Issue 2: MetaMask không kết nối
**Giải pháp:**
1. Reset account trong MetaMask:
   - Settings → Advanced → Reset Account
2. Clear browser cache
3. Refresh page

### Issue 3: Transaction failed
**Lỗi:** `Transaction reverted`
**Giải pháp:**
1. Kiểm tra balance đủ ETH
2. Kiểm tra network đúng (localhost hoặc Sepolia)
3. Xem console logs để biết lỗi cụ thể

### Issue 4: Contract không deploy
**Lỗi:** `Error HH606: The project cannot be compiled`
**Giải pháp:**
```bash
cd smart_contract
npx hardhat clean
npx hardhat compile
```

### Issue 5: Frontend không connect wallet
**Giải pháp:**
1. Đảm bảo MetaMask đã cài đặt
2. Reload extension
3. Check network trong MetaMask
4. Xem console logs

---

## 🧪 Testing

### Chạy Tests:
```bash
cd smart_contract
npx hardhat test
```

### Test Specific File:
```bash
npx hardhat test test/sample-test.js
```

### Test với Coverage:
```bash
npm install --save-dev solidity-coverage
npx hardhat coverage
```

---

## 📚 Scripts Hữu Ích

### Smart Contract:
```bash
# Compile contracts
npx hardhat compile

# Clean artifacts
npx hardhat clean

# Run local node
npx hardhat node

# Deploy
npx hardhat run scripts/deployAll.js --network localhost

# Test
npx hardhat test

# Check contract size
npx hardhat size-contracts
```

### Frontend:
```bash
# Development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## 🔐 Bảo Mật

### ⚠️ QUAN TRỌNG:
1. **KHÔNG BAO GIỜ** commit private keys thật lên GitHub
2. **SỬ DỤNG** `.env` file cho sensitive data
3. **CHỈ DÙNG** test accounts cho development
4. **KIỂM TRA** contracts trước khi deploy mainnet

### Tạo .env file:
```bash
# smart_contract/.env
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Thêm vào `.gitignore`:**
```
.env
*.key
```

---

## 🎨 Tính Năng Có Thể Test

### 1. Gửi ETH:
- Connect wallet
- Nhập địa chỉ receiver
- Nhập số ETH
- Nhập message & keyword
- Send Transaction

### 2. Mint NFT:
- Prepare metadata JSON
- Upload lên IPFS
- Mint NFT với IPFS hash
- View NFT trong wallet

### 3. Transfer Token:
- Approve tokens
- Transfer MWT tokens
- Check balance

---

## 📖 Tài Liệu Thêm

- [Hardhat Docs](https://hardhat.org/docs)
- [Ethers.js Docs](https://docs.ethers.org/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [MetaMask Docs](https://docs.metamask.io/)

---

## 🎉 Quick Start (TL;DR)

```bash
# Terminal 1
cd smart_contract && npx hardhat node

# Terminal 2 (new)
cd smart_contract && npx hardhat run scripts/deployAll.js --network localhost

# Terminal 3 (new)
cd client && npm run dev

# Browser
# 1. Open http://localhost:5173
# 2. Connect MetaMask (network: Localhost 8545)
# 3. Import test account from Terminal 1
# 4. Start using the app! 🚀
```

---

## 💡 Tips

1. **Luôn chạy** Hardhat node trước khi deploy
2. **Kiểm tra** network trong MetaMask
3. **Lưu** contract addresses sau mỗi deploy
4. **Xem logs** trong console để debug
5. **Reset account** MetaMask nếu gặp vấn đề nonce

---

## 🆘 Cần Giúp Đỡ?

- GitHub Issues: [Report bugs](https://github.com/Dungsenpai-ux/Modern-Web-3.0/issues)
- Docs: Xem các file `*.md` trong project
- Logs: Check console trong browser và terminal

---

