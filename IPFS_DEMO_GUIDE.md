# 🎯 Hướng Dẫn Test IPFS Demo

## 📦 Cài Đặt

Các package đã được cài đặt:
- ✅ `helia` - IPFS client
- ✅ `@helia/unixfs` - File system
- ✅ `@helia/strings` - String handling

## 🚀 Chạy Demo

### Cách 1: Thêm vào App.jsx

```javascript
// File: client/src/App.jsx
import IPFSDemo from './components/IPFSDemo';

function App() {
  return (
    <div>
      {/* Thêm route hoặc component */}
      <IPFSDemo />
    </div>
  );
}
```

### Cách 2: Tạo route riêng

```javascript
// Thêm vào routing
<Route path="/ipfs-demo" element={<IPFSDemo />} />
```

Sau đó truy cập: `http://localhost:5173/ipfs-demo`

---

## 🎮 Cách Sử Dụng Demo

### **Test 1: Upload JSON**

1. Nhập message: `Hello IPFS!`
2. Nhập GIF URL: `https://usagif.com/wp-content/uploads/gif-shaking-head-38.gif`
3. Click **"Upload JSON to IPFS"**
4. Xem logs bên phải để theo dõi quá trình:
   ```
   🚀 Bắt đầu upload JSON lên IPFS...
   📦 Dữ liệu chuẩn bị upload: {...}
   ✅ Upload thành công!
   🔑 IPFS Hash (CID): QmXxx...
   🌐 IPFS URL: https://ipfs.io/ipfs/QmXxx...
   ```

5. Kết quả sẽ hiển thị:
   - **Hash**: `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG`
   - **URL**: Link để xem data trên IPFS

### **Test 2: Retrieve Data**

1. Sau khi upload thành công (có hash)
2. Click **"Retrieve from IPFS"**
3. Xem logs:
   ```
   🔍 Bắt đầu lấy dữ liệu từ IPFS...
   🔑 Sử dụng hash: QmXxx...
   ✅ Retrieve thành công!
   📄 Dữ liệu nhận được: {...}
   ```

4. Data sẽ hiển thị trong box "Retrieved Data"

### **Test 3: Upload File**

1. Click **"Choose File"**
2. Chọn 1 ảnh hoặc GIF từ máy
3. File tự động upload
4. Nhận hash và URL
5. Mở URL để xem file trên IPFS

### **Test 4: Upload GIF từ URL**

1. Nhập GIF URL vào ô input
2. Click **"Upload GIF URL to IPFS"**
3. GIF sẽ được tải về và upload lên IPFS
4. Nhận hash mới

---

## 📊 Luồng Dữ Liệu Chi Tiết

### **Ví dụ 1: Upload và Retrieve**

```
STEP 1: USER INPUT
┌─────────────────────────┐
│ Message: "Hello IPFS!"  │
│ GIF URL: "https://..."  │
└─────────────────────────┘
           ↓
STEP 2: PREPARE DATA
┌─────────────────────────────────────┐
│ {                                   │
│   message: "Hello IPFS!",           │
│   gifUrl: "https://...",            │
│   timestamp: "2025-10-12T...",      │
│   additionalInfo: {...}             │
│ }                                   │
└─────────────────────────────────────┘
           ↓
STEP 3: STRINGIFY JSON
┌─────────────────────────────────────┐
│ '{"message":"Hello IPFS!",...}'     │
└─────────────────────────────────────┘
           ↓
STEP 4: UPLOAD TO IPFS
┌─────────────────────────────────────┐
│ Helia uploads to IPFS network       │
│ - Data distributed across nodes     │
│ - Generate unique CID               │
└─────────────────────────────────────┘
           ↓
STEP 5: RECEIVE CID
┌─────────────────────────────────────┐
│ CID: QmYwAPJzv5CZsnA625s3Xf2...     │
│ URL: https://ipfs.io/ipfs/QmYwAP... │
└─────────────────────────────────────┘
           ↓
STEP 6: RETRIEVE
┌─────────────────────────────────────┐
│ Query IPFS with CID                 │
│ Get original data back              │
└─────────────────────────────────────┘
```

---

## 🔍 Console Testing

Bạn cũng có thể test trực tiếp trong console:

```javascript
// Mở Console (F12)

// Import functions
import { uploadJSONToIPFS, getFromIPFS } from './utils/ipfs';

// Test 1: Upload
const testData = {
  message: "Console test",
  timestamp: Date.now()
};

const result = await uploadJSONToIPFS(testData);
console.log("Uploaded:", result);
// { hash: "QmXxx...", url: "https://ipfs.io/ipfs/QmXxx..." }

// Test 2: Retrieve
const retrieved = await getFromIPFS(result.hash);
console.log("Retrieved:", JSON.parse(retrieved));
// { message: "Console test", timestamp: 1697097600000 }

// Test 3: Verify
console.log("Match:", JSON.stringify(testData) === retrieved);
// true
```

---

## 📝 Logs Giải Thích

### Khi Upload:
```
[10:30:45] 🚀 Bắt đầu upload JSON lên IPFS...
→ Bắt đầu quá trình upload

[10:30:45] 📦 Dữ liệu chuẩn bị upload: {...}
→ Hiển thị data sẽ được upload

[10:30:47] ✅ Upload thành công!
→ Upload hoàn tất

[10:30:47] 🔑 IPFS Hash (CID): QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
→ Hash duy nhất của dữ liệu

[10:30:47] 🌐 IPFS URL: https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
→ URL công khai để truy cập
```

### Khi Retrieve:
```
[10:31:00] 🔍 Bắt đầu lấy dữ liệu từ IPFS...
→ Bắt đầu download

[10:31:00] 🔑 Sử dụng hash: QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
→ Query với hash này

[10:31:02] ✅ Retrieve thành công!
→ Download hoàn tất

[10:31:02] 📄 Dữ liệu nhận được: {...}
→ Hiển thị data đã lấy được
```

---

## 🎨 UI Components

### **Input Section:**
- Message input
- GIF URL input
- File upload

### **Action Buttons:**
1. **Upload JSON** - Upload dữ liệu JSON
2. **Upload GIF URL** - Upload GIF từ URL
3. **Retrieve** - Lấy data từ IPFS
4. **Reset** - Reset demo

### **Result Sections:**
- **IPFS Upload Result** (xanh lá)
  - Hash (CID)
  - URL để xem

- **Retrieved Data** (xanh dương)
  - Data đã parse từ IPFS

### **Activity Logs:**
- Info (xanh dương)
- Success (xanh lá)
- Error (đỏ)

---

## 🧪 Test Cases

### Test Case 1: Upload Simple JSON
```javascript
Input: { message: "Test" }
Expected Output: CID starts with "Qm..."
```

### Test Case 2: Upload Complex JSON
```javascript
Input: {
  message: "Complex",
  nested: { data: [1, 2, 3] }
}
Expected Output: Valid CID, retrievable
```

### Test Case 3: Upload File
```javascript
Input: image.gif (from file system)
Expected Output: CID, viewable via IPFS URL
```

### Test Case 4: Retrieve Non-existent Hash
```javascript
Input: "QmFakeHash123"
Expected Output: Error in logs
```

---

## 🐛 Troubleshooting

### Issue 1: Upload chậm
**Nguyên nhân:** IPFS network congestion
**Giải pháp:** Đợi, hoặc thử lại sau

### Issue 2: Retrieve lỗi
**Nguyên nhân:** Hash không tồn tại hoặc chưa propagate
**Giải pháp:** 
- Kiểm tra hash đúng chưa
- Đợi vài giây rồi thử lại

### Issue 3: CORS error
**Nguyên nhân:** Browser block IPFS requests
**Giải pháp:**
- Sử dụng IPFS gateway khác
- Hoặc run local IPFS node

---

## 💡 Tips

1. **Hash là bất biến**: Cùng data = cùng hash
2. **Test với data nhỏ**: Upload nhanh hơn
3. **Lưu hash**: Để test retrieve sau
4. **Xem logs**: Hiểu rõ quá trình

---

## 📚 Tài Liệu Thêm

- IPFS Docs: https://docs.ipfs.tech/
- Helia Docs: https://github.com/ipfs/helia
- IPFS Explorer: https://explore.ipfs.io/

---

**Happy Testing! 🎉**

Bạn giờ có thể:
1. Thấy được luồng dữ liệu IPFS
2. Test upload/retrieve
3. Hiểu cách IPFS hoạt động
4. Áp dụng vào dự án thực tế
