import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { strings } from '@helia/strings';

let heliaInstance = null;

// Khởi tạo Helia instance
export const getHelia = async () => {
  if (!heliaInstance) {
    heliaInstance = await createHelia();
  }
  return heliaInstance;
};

// Upload JSON data lên IPFS
export const uploadJSONToIPFS = async (data) => {
  try {
    const helia = await getHelia();
    const s = strings(helia);
    
    const jsonString = JSON.stringify(data);
    const cid = await s.add(jsonString);
    
    return {
      hash: cid.toString(),
      url: `https://ipfs.io/ipfs/${cid.toString()}`
    };
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw error;
  }
};

// Upload file lên IPFS
export const uploadFileToIPFS = async (file) => {
  try {
    const helia = await getHelia();
    const fs = unixfs(helia);
    
    // Chuyển file thành bytes
    const fileBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(fileBuffer);
    
    const cid = await fs.addBytes(bytes);
    
    return {
      hash: cid.toString(),
      url: `https://ipfs.io/ipfs/${cid.toString()}`
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

// Lấy dữ liệu từ IPFS bằng hash
export const getFromIPFS = async (hash) => {
  try {
    const helia = await getHelia();
    const s = strings(helia);
    
    const data = await s.get(hash);
    return data;
  } catch (error) {
    console.error('Error getting from IPFS:', error);
    throw error;
  }
};

// Lấy file từ IPFS
export const getFileFromIPFS = async (hash) => {
  try {
    const helia = await getHelia();
    const fs = unixfs(helia);
    
    const decoder = new TextDecoder();
    let content = '';
    
    for await (const chunk of fs.cat(hash)) {
      content += decoder.decode(chunk, { stream: true });
    }
    
    return content;
  } catch (error) {
    console.error('Error getting file from IPFS:', error);
    throw error;
  }
};

// Upload ảnh/GIF URL lên IPFS
export const uploadImageURLToIPFS = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const helia = await getHelia();
    const fs = unixfs(helia);
    
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    const cid = await fs.addBytes(bytes);
    
    return {
      hash: cid.toString(),
      url: `https://ipfs.io/ipfs/${cid.toString()}`
    };
  } catch (error) {
    console.error('Error uploading image URL to IPFS:', error);
    throw error;
  }
};

// Đóng Helia instance
export const closeHelia = async () => {
  if (heliaInstance) {
    await heliaInstance.stop();
    heliaInstance = null;
  }
};

export default {
  getHelia,
  uploadJSONToIPFS,
  uploadFileToIPFS,
  getFromIPFS,
  getFileFromIPFS,
  uploadImageURLToIPFS,
  closeHelia,
};
