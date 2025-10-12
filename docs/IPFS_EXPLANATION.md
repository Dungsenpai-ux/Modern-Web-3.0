# IPFS Integration - Giải Thích Chi Tiết

## 📚 IPFS Là Gì?

**IPFS (InterPlanetary File System)** là một hệ thống lưu trữ file phi tập trung (decentralized), hoạt động như một mạng lưới peer-to-peer.

### Đặc Điểm:
- **Phi tập trung**: Dữ liệu không lưu trên 1 server duy nhất
- **Content-addressed**: Mỗi file có 1 hash duy nhất (CID)
- **Bất biến**: Không thể thay đổi nội dung sau khi upload
- **Hiệu quả**: Deduplication - file giống nhau chỉ lưu 1 lần

---

## 🔄 Luồng Dữ Liệu IPFS Trong Dự Án

### **1. Upload Dữ Liệu Lên IPFS**

```
┌──────────────────────────────────────────────────────────────┐
│                     UPLOAD PROCESS                            │
└──────────────────────────────────────────────────────────────┘

User Input                    Frontend                    IPFS Network
    │                            │                            │
    │  1. Nhập dữ liệu          │                            │
    │  (text, image, JSON)       │                            │
    ├──────────────────────────>│                            │
    │                            │                            │
    │                            │  2. Khởi tạo Helia        │
    │                            │  heliaInstance = await    │
    │                            │  createHelia()            │
    │                            │                            │
    │                            │  3. Chuyển đổi dữ liệu    │
    │                            │  - JSON → string          │
    │                            │  - File → bytes           │
    │                            │                            │
    │                            │  4. Upload to IPFS        │
    │                            ├──────────────────────────>│
    │                            │  await s.add(data)        │
    │                            │                            │
    │                            │  5. Nhận CID (Hash)       │
    │                            │<──────────────────────────│
    │                            │  CID: QmXxx...            │
    │                            │                            │
    │  6. Return CID + URL       │                            │
    │<──────────────────────────│                            │
    │  {                         │                            │
    │    hash: "QmXxx...",       │                            │
    │    url: "ipfs.io/ipfs/..." │                            │
    │  }                         │                            │
```

### **2. Lưu CID Vào Blockchain**

```
┌──────────────────────────────────────────────────────────────┐
│              BLOCKCHAIN STORAGE PROCESS                       │
└──────────────────────────────────────────────────────────────┘

Frontend              Smart Contract              Blockchain
    │                        │                         │
    │  1. Có CID từ IPFS    │                         │
    │  hash: "QmXxx..."     │                         │
    │                        │                         │
    │  2. Gọi hàm contract  │                         │
    │  addToBlockchain()    │                         │
    ├──────────────────────>│                         │
    │  (receiver, amount,   │                         │
    │   message, keyword,   │                         │
    │   ipfsHash)          │                         │
    │                        │                         │
    │                        │  3. Lưu transaction    │
    │                        │  với ipfsHash          │
    │                        ├───────────────────────>│
    │                        │                         │
    │                        │  4. Emit event         │
    │                        │<───────────────────────│
    │                        │  Transfer(...)         │
    │                        │                         │
    │  5. Transaction hash  │                         │
    │<──────────────────────│                         │
```

### **3. Lấy Dữ Liệu Từ IPFS**

```
┌──────────────────────────────────────────────────────────────┐
│                   RETRIEVE PROCESS                            │
└──────────────────────────────────────────────────────────────┘

Frontend           Smart Contract           IPFS Network
    │                   │                        │
    │  1. Lấy txs       │                        │
    │  từ blockchain    │                        │
    ├─────────────────>│                        │
    │                   │                        │
    │  2. Return txs    │                        │
    │  với ipfsHash     │                        │
    │<─────────────────│                        │
    │  [{               │                        │
    │    ipfsHash:      │                        │
    │    "QmXxx..."     │                        │
    │  }]               │                        │
    │                   │                        │
    │  3. Dùng hash     │                        │
    │  query IPFS       │                        │
    ├──────────────────────────────────────────>│
    │  await getFromIPFS(hash)                  │
    │                                            │
    │  4. Return data                            │
    │<──────────────────────────────────────────│
    │  { gifUrl, message, timestamp... }        │
    │                                            │
    │  5. Hiển thị data                         │
    │  trên UI                                  │
```

---

## 💡 Ví Dụ Cụ Thể

### **Kịch Bản: Gửi Giao Dịch Với GIF**

#### **Bước 1: User nhập thông tin**
```javascript
// User nhập trên form:
{
  addressTo: "0x1234...",
  amount: "0.1",
  message: "Happy Birthday!",
  keyword: "celebration",
  gifUrl: "https://usagif.com/wp-content/uploads/gif-shaking-head-38.gif"
}
```

#### **Bước 2: Upload metadata lên IPFS**
```javascript
// Trong TransactionContext.jsx
const ipfsData = {
  gifUrl: "https://usagif.com/wp-content/uploads/gif-shaking-head-38.gif",
  additionalMessage: "Happy Birthday!",
  timestamp: "2025-10-12T10:30:00Z"
};

// Upload lên IPFS
const { hash } = await uploadJSONToIPFS(ipfsData);
// hash = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
```

#### **Bước 3: Lưu hash vào blockchain**
```javascript
// Gọi smart contract
const tx = await transactionsContract.addToBlockchain(
  "0x1234...",                    // receiver
  parseEther("0.1"),              // amount
  "Happy Birthday!",              // message
  "celebration",                  // keyword
  "QmYwAPJzv5CZsnA625..."         // ipfsHash ← ĐÂY
);

// Blockchain lưu:
Transaction {
  sender: "0xABCD...",
  receiver: "0x1234...",
  amount: 0.1 ETH,
  message: "Happy Birthday!",
  keyword: "celebration",
  ipfsHash: "QmYwAPJzv5CZsnA625..."  ← Hash IPFS
}
```

#### **Bước 4: Lấy và hiển thị**
```javascript
// Lấy transactions từ blockchain
const txs = await transactionsContract.getAllTransactions();

// Với mỗi transaction
for (const tx of txs) {
  // Lấy metadata từ IPFS bằng hash
  const ipfsData = await getFromIPFS(tx.ipfsHash);
  // ipfsData = { gifUrl: "...", additionalMessage: "...", ... }
  
  // Hiển thị GIF từ URL
  <img src={ipfsData.gifUrl} alt="transaction gif" />
}
```

---

## 🎯 Tại Sao Dùng IPFS?

### **So Sánh: Không Dùng IPFS vs Dùng IPFS**

#### **❌ KHÔNG dùng IPFS:**
```javascript
// Lưu URL trực tiếp trong blockchain
Transaction {
  message: "Hello",
  gifUrl: "https://usagif.com/gif-shaking-head-38.gif" 
  // ← URL có thể bị xóa hoặc thay đổi
}
```
**Vấn đề:**
- ❌ Link có thể chết (404)
- ❌ Nội dung có thể bị thay đổi
- ❌ Phụ thuộc vào server trung tâm

#### **✅ Dùng IPFS:**
```javascript
// Lưu hash IPFS trong blockchain
Transaction {
  message: "Hello",
  ipfsHash: "QmXxx..." 
  // ← Hash bất biến, nội dung được đảm bảo
}
```
**Lợi ích:**
- ✅ Dữ liệu phi tập trung
- ✅ Hash bất biến
- ✅ Nội dung được đảm bảo
- ✅ Có thể verify data integrity

---

## 📊 Luồng Dữ Liệu Hoàn Chỉnh

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPLETE DATA FLOW                        │
└─────────────────────────────────────────────────────────────┘

1. USER INPUT
   ↓
   User fills form:
   - Receiver address
   - Amount
   - Message
   - GIF URL
   
2. IPFS UPLOAD
   ↓
   Frontend uploads metadata to IPFS:
   {
     gifUrl: "...",
     message: "...",
     timestamp: "..."
   }
   ↓
   Returns: CID (QmXxx...)
   
3. BLOCKCHAIN TRANSACTION
   ↓
   Frontend calls smart contract:
   addToBlockchain(receiver, amount, message, keyword, ipfsHash)
   ↓
   Smart contract stores:
   - All transaction data
   - IPFS hash
   ↓
   Returns: Transaction hash
   
4. DISPLAY
   ↓
   Frontend queries blockchain:
   getAllTransactions()
   ↓
   For each transaction:
   - Get ipfsHash
   - Query IPFS with hash
   - Get metadata
   - Display GIF + data
```

---

## 🛠️ Các Hàm Chính Trong ipfs.js

### **1. uploadJSONToIPFS(data)**
```javascript
// Input: JavaScript object
const data = { name: "John", age: 30 };

// Process: 
// 1. Stringify: '{"name":"John","age":30}'
// 2. Upload to IPFS
// 3. Get CID

// Output:
{
  hash: "QmXxx...",
  url: "https://ipfs.io/ipfs/QmXxx..."
}
```

### **2. uploadFileToIPFS(file)**
```javascript
// Input: File object (from <input type="file">)
const file = document.querySelector('input[type="file"]').files[0];

// Process:
// 1. Convert to ArrayBuffer
// 2. Convert to Uint8Array
// 3. Upload bytes to IPFS
// 4. Get CID

// Output:
{
  hash: "QmYyy...",
  url: "https://ipfs.io/ipfs/QmYyy..."
}
```

### **3. getFromIPFS(hash)**
```javascript
// Input: IPFS hash
const hash = "QmXxx...";

// Process:
// 1. Query IPFS network with hash
// 2. Download content
// 3. Parse JSON

// Output: Original data
{ name: "John", age: 30 }
```

---

## 🎨 Ví Dụ Thực Tế: Upload GIF

```javascript
// 1. User chọn GIF từ máy
<input type="file" accept="image/gif" onChange={handleGifUpload} />

// 2. Upload GIF lên IPFS
const handleGifUpload = async (event) => {
  const file = event.target.files[0];
  
  console.log("Uploading to IPFS...");
  const { hash, url } = await uploadFileToIPFS(file);
  
  console.log("IPFS Hash:", hash);
  // QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
  
  console.log("IPFS URL:", url);
  // https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
  
  // 3. Lưu hash này vào blockchain
  await sendTransaction({ ipfsHash: hash });
};

// 4. Khi hiển thị, dùng URL
<img src={`https://ipfs.io/ipfs/${transaction.ipfsHash}`} />
```

---

## 🔍 Debug & Testing

### **Test Upload:**
```javascript
// Test trong console
import { uploadJSONToIPFS } from './utils/ipfs';

const testData = {
  message: "Test message",
  timestamp: Date.now()
};

const result = await uploadJSONToIPFS(testData);
console.log(result);
// { hash: "QmXxx...", url: "https://ipfs.io/ipfs/QmXxx..." }

// Verify bằng cách mở URL trong browser
```

### **Test Download:**
```javascript
import { getFromIPFS } from './utils/ipfs';

const hash = "QmXxx..."; // Hash từ bước trên
const data = await getFromIPFS(hash);
console.log(data);
// { message: "Test message", timestamp: 1697097600000 }
```

---

## 💾 Lưu Ý Quan Trọng

1. **IPFS là phi tập trung nhưng cần pinning:**
   - Data có thể bị xóa nếu không có node nào lưu
   - Nên dùng dịch vụ pinning như Pinata, Infura

2. **Performance:**
   - Upload/download có thể chậm
   - Nên show loading indicator

3. **Cost:**
   - IPFS upload miễn phí
   - Nhưng pinning services có phí

4. **Blockchain chỉ lưu hash:**
   - Tiết kiệm gas fee
   - Data thực sự ở IPFS

---

**Tóm lại:** IPFS giúp lưu trữ dữ liệu lớn (ảnh, video, metadata) một cách phi tập trung, trong khi blockchain chỉ lưu hash để tham chiếu đến dữ liệu đó.
