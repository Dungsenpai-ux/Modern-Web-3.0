import axios from 'axios';

/**
 * IPFS Integration sử dụng Pinata API
 * 
 * Pinata là dịch vụ pinning IPFS miễn phí và dễ sử dụng
 * Bạn có thể đăng ký miễn phí tại: https://www.pinata.cloud/
 * 
 * Để sử dụng:
 * 1. Đăng ký tại https://app.pinata.cloud/
 * 2. Lấy API Key và Secret
 * 3. Thêm vào .env file:
 *    VITE_PINATA_API_KEY=your_api_key
 *    VITE_PINATA_API_SECRET=your_api_secret
 */

// Pinata API endpoints
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

// Hoặc sử dụng public IPFS gateway (không cần API key)
const PUBLIC_GATEWAY = 'https://ipfs.io/ipfs';

/**
 * Upload JSON data lên IPFS thông qua Pinata
 * @param {Object} data - JavaScript object to upload
 * @returns {Promise<{hash: string, url: string}>}
 */
export const uploadJSONToIPFS = async (data) => {
  try {
    console.log('📤 Uploading JSON to IPFS via Pinata...');
    
    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataSecretKey = import.meta.env.VITE_PINATA_API_SECRET;
    
    if (!pinataApiKey || !pinataSecretKey) {
      console.warn('⚠️ Pinata API keys not found. Using alternative method...');
      return await uploadJSONToIPFSPublic(data);
    }

    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      {
        pinataContent: data,
        pinataMetadata: {
          name: `transaction_${Date.now()}.json`
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey
        }
      }
    );

    const hash = response.data.IpfsHash;
    console.log('✅ Upload successful! Hash:', hash);

    return {
      hash,
      url: `${PINATA_GATEWAY}/${hash}`
    };
  } catch (error) {
    console.error('❌ Error uploading JSON to IPFS:', error);
    
    // Fallback to alternative method
    console.log('🔄 Trying alternative upload method...');
    return await uploadJSONToIPFSPublic(data);
  }
};

/**
 * Upload JSON sử dụng public IPFS API (không cần API key)
 * @param {Object} data 
 * @returns {Promise<{hash: string, url: string}>}
 */
const uploadJSONToIPFSPublic = async (data) => {
  try {
    // Sử dụng public IPFS HTTP API (nft.storage hoặc web3.storage)
    // Đây là demo - trong production nên dùng Pinata hoặc Infura
    
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('file', blob, 'data.json');

    const response = await axios.post(
      'https://ipfs.infura.io:5001/api/v0/add',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    const hash = response.data.Hash;
    
    return {
      hash,
      url: `${PUBLIC_GATEWAY}/${hash}`
    };
  } catch (error) {
    console.error('❌ Public upload failed:', error);
    
    // Last fallback: Create a mock hash
    const mockHash = 'Qm' + btoa(JSON.stringify(data)).substring(0, 44);
    console.warn('⚠️ Using mock hash for development:', mockHash);
    
    return {
      hash: mockHash,
      url: `${PUBLIC_GATEWAY}/${mockHash}`,
      isMock: true,
      data: data // Store data locally for mock
    };
  }
};

/**
 * Upload file lên IPFS
 * @param {File} file - File object from input
 * @returns {Promise<{hash: string, url: string}>}
 */
export const uploadFileToIPFS = async (file) => {
  try {
    console.log('📤 Uploading file to IPFS via Pinata...');
    
    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataSecretKey = import.meta.env.VITE_PINATA_API_SECRET;
    
    if (!pinataApiKey || !pinataSecretKey) {
      console.warn('⚠️ Pinata API keys not found');
      throw new Error('Pinata API keys required for file upload');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('pinataMetadata', JSON.stringify({
      name: file.name
    }));

    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretKey
        }
      }
    );

    const hash = response.data.IpfsHash;
    console.log('✅ File upload successful! Hash:', hash);

    return {
      hash,
      url: `${PINATA_GATEWAY}/${hash}`
    };
  } catch (error) {
    console.error('❌ Error uploading file to IPFS:', error);
    throw error;
  }
};

/**
 * Lấy dữ liệu từ IPFS bằng hash
 * @param {string} hash - IPFS hash (CID)
 * @returns {Promise<string>} - JSON string
 */
export const getFromIPFS = async (hash) => {
  try {
    console.log('🔍 Fetching from IPFS:', hash);
    
    // Try Pinata gateway first
    try {
      const response = await axios.get(`${PINATA_GATEWAY}/${hash}`);
      return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    } catch {
      // Fallback to public gateway
      const response = await axios.get(`${PUBLIC_GATEWAY}/${hash}`);
      return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    }
  } catch (error) {
    console.error('❌ Error fetching from IPFS:', error);
    throw error;
  }
};

/**
 * Lấy file từ IPFS
 * @param {string} hash - IPFS hash
 * @returns {Promise<Blob>}
 */
export const getFileFromIPFS = async (hash) => {
  try {
    const response = await axios.get(`${PUBLIC_GATEWAY}/${hash}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error getting file from IPFS:', error);
    throw error;
  }
};

/**
 * Upload ảnh/GIF URL lên IPFS
 * @param {string} imageUrl - URL of image
 * @returns {Promise<{hash: string, url: string}>}
 */
export const uploadImageURLToIPFS = async (imageUrl) => {
  try {
    console.log('🌐 Downloading image from URL...');
    
    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'blob'
    });
    
    // Convert to File object
    const file = new File([response.data], 'image.gif', { type: response.data.type });
    
    // Upload to IPFS
    return await uploadFileToIPFS(file);
  } catch (error) {
    console.error('❌ Error uploading image URL to IPFS:', error);
    throw error;
  }
};

export default {
  uploadJSONToIPFS,
  uploadFileToIPFS,
  getFromIPFS,
  getFileFromIPFS,
  uploadImageURLToIPFS,
};

