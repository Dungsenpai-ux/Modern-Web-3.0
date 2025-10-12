# ⚡ Quick Start - Modern Web 3.0

## 🚀 Chạy Nhanh (3 Bước)

### Bước 1: Start Blockchain (Terminal 1)
```bash
cd smart_contract
npx hardhat node
```
✅ **Để terminal này chạy!** Không tắt!

---

### Bước 2: Deploy Contracts (Terminal 2 - Mở terminal mới)
```bash
cd smart_contract
npx hardhat run scripts/deployAll.js --network localhost
```
✅ **Lưu lại contract addresses!**

---

### Bước 3: Start Frontend (Terminal 3 - Mở terminal mới)
```bash
cd client

# Dùng npm (KHÔNG phải yarn)
npm run dev

# Hoặc
npm start
```

**Nếu lỗi, thử:**
```bash
npm install
npm run dev
```

✅ **Truy cập:** http://localhost:5173

---

## 🦊 Setup MetaMask

### 1. Thêm Localhost Network:
- **Network Name:** Localhost 8545
- **RPC URL:** http://127.0.0.1:8545
- **Chain ID:** 31337
- **Currency:** ETH

### 2. Import Test Account:
Copy Private Key từ Terminal 1 (Hardhat node):
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

MetaMask → Import Account → Paste private key

### 3. Connect:
- Mở http://localhost:5173
- Click "Connect Wallet"
- Approve

---

## ❌ Lỗi Thường Gặp

### "yarn: command not found"
**Nguyên nhân:** Project dùng npm/Vite, không phải yarn

**Giải pháp:**
```bash
# Dùng npm thay vì yarn
npm run dev

# KHÔNG dùng:
yarn start  # ❌ SAI
```

### "Port 8545 already in use"
**Giải pháp:**
```bash
# Tắt process đang dùng port
# Windows:
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8545 | xargs kill -9
```

### "Cannot find module"
**Giải pháp:**
```bash
cd client
npm install
npm run dev
```

---

## 📋 Commands Chính

### Smart Contract:
```bash
cd smart_contract

# Chạy local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deployAll.js --network localhost

# Test contracts
npx hardhat test

# Compile
npx hardhat compile

# Clean
npx hardhat clean
```

### Frontend:
```bash
cd client

# Development (Vite)
npm run dev          # ✅ ĐÚNG

# Build production
npm run build

# Preview build
npm run serve

# Install dependencies
npm install
```

---

## ✅ Checklist Trước Khi Chạy

- [ ] Node.js đã cài (v16+)
- [ ] MetaMask đã cài
- [ ] Đã `npm install` trong cả 2 folder
- [ ] Terminal 1: Hardhat node đang chạy
- [ ] Terminal 2: Đã deploy contracts
- [ ] Terminal 3: Frontend đang chạy
- [ ] MetaMask đã connect localhost network
- [ ] MetaMask đã import test account

---

## 🎯 Tóm Tắt

| Terminal | Thư Mục | Command | Port |
|----------|---------|---------|------|
| 1 | smart_contract | `npx hardhat node` | 8545 |
| 2 | smart_contract | `npx hardhat run scripts/deployAll.js --network localhost` | - |
| 3 | client | `npm run dev` | 5173 |

**Browser:** http://localhost:5173

---

## 💡 Tips

1. **Luôn** chạy Hardhat node trước
2. **Chỉ deploy** khi Hardhat node đang chạy
3. **Dùng npm**, không phải yarn
4. **Check** console logs nếu lỗi
5. **Reset** MetaMask account nếu transaction lỗi

---

**Xem hướng dẫn chi tiết:** `HOW_TO_RUN.md`
