import React, { useState } from 'react';
import { uploadJSONToIPFS, uploadFileToIPFS, getFromIPFS, uploadImageURLToIPFS } from '../utils/ipfs';

/**
 * Component Demo IPFS - Để test và visualize luồng dữ liệu
 */
const IPFSDemo = () => {
  const [step, setStep] = useState('input');
  const [formData, setFormData] = useState({
    message: '',
    gifUrl: '',
    timestamp: ''
  });
  const [ipfsResult, setIpfsResult] = useState(null);
  const [retrievedData, setRetrievedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  // BƯỚC 1: Upload JSON lên IPFS
  const handleUploadJSON = async () => {
    setLoading(true);
    setStep('uploading');
    addLog('🚀 Bắt đầu upload JSON lên IPFS...', 'info');

    try {
      const data = {
        message: formData.message || 'Test message from Modern Web 3.0',
        gifUrl: formData.gifUrl || 'https://usagif.com/wp-content/uploads/gif-shaking-head-38.gif',
        timestamp: new Date().toISOString(),
        additionalInfo: {
          sender: 'Demo User',
          platform: 'Modern Web 3.0',
          version: '1.0.0'
        }
      };

      addLog('📦 Dữ liệu chuẩn bị upload: ' + JSON.stringify(data, null, 2), 'success');
      
      const result = await uploadJSONToIPFS(data);
      
      addLog('✅ Upload thành công!', 'success');
      addLog('🔑 IPFS Hash (CID): ' + result.hash, 'success');
      addLog('🌐 IPFS URL: ' + result.url, 'success');
      
      setIpfsResult(result);
      setStep('uploaded');
    } catch (error) {
      addLog('❌ Lỗi upload: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 2: Lấy dữ liệu từ IPFS bằng hash
  const handleRetrieveFromIPFS = async () => {
    if (!ipfsResult?.hash) {
      addLog('⚠️ Chưa có hash để retrieve!', 'error');
      return;
    }

    setLoading(true);
    setStep('retrieving');
    addLog('🔍 Bắt đầu lấy dữ liệu từ IPFS...', 'info');
    addLog('🔑 Sử dụng hash: ' + ipfsResult.hash, 'info');

    try {
      const data = await getFromIPFS(ipfsResult.hash);
      const parsedData = JSON.parse(data);
      
      addLog('✅ Retrieve thành công!', 'success');
      addLog('📄 Dữ liệu nhận được: ' + JSON.stringify(parsedData, null, 2), 'success');
      
      setRetrievedData(parsedData);
      setStep('retrieved');
    } catch (error) {
      addLog('❌ Lỗi retrieve: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 3: Upload file/image
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    addLog('📁 File được chọn: ' + file.name, 'info');
    addLog('📊 Kích thước: ' + (file.size / 1024).toFixed(2) + ' KB', 'info');

    try {
      const result = await uploadFileToIPFS(file);
      
      addLog('✅ Upload file thành công!', 'success');
      addLog('🔑 IPFS Hash: ' + result.hash, 'success');
      addLog('🖼️ Bạn có thể xem file tại: ' + result.url, 'success');
      
      setIpfsResult(result);
    } catch (error) {
      addLog('❌ Lỗi upload file: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 4: Upload GIF từ URL
  const handleUploadGifURL = async () => {
    if (!formData.gifUrl) {
      addLog('⚠️ Vui lòng nhập GIF URL!', 'error');
      return;
    }

    setLoading(true);
    addLog('🌐 Đang tải GIF từ URL: ' + formData.gifUrl, 'info');

    try {
      const result = await uploadImageURLToIPFS(formData.gifUrl);
      
      addLog('✅ Upload GIF thành công!', 'success');
      addLog('🔑 IPFS Hash: ' + result.hash, 'success');
      addLog('🎨 GIF giờ được lưu trên IPFS: ' + result.url, 'success');
      
      setIpfsResult(result);
    } catch (error) {
      addLog('❌ Lỗi upload GIF: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetDemo = () => {
    setStep('input');
    setFormData({ message: '', gifUrl: '', timestamp: '' });
    setIpfsResult(null);
    setRetrievedData(null);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🚀 IPFS Demo - Visualize Data Flow
        </h1>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 bg-white/10 rounded-lg p-4">
          <div className={`flex-1 text-center ${step === 'input' ? 'text-yellow-400 font-bold' : 'text-white/50'}`}>
            1️⃣ Input Data
          </div>
          <div className={`flex-1 text-center ${step === 'uploading' || step === 'uploaded' ? 'text-yellow-400 font-bold' : 'text-white/50'}`}>
            2️⃣ Upload to IPFS
          </div>
          <div className={`flex-1 text-center ${step === 'retrieving' || step === 'retrieved' ? 'text-yellow-400 font-bold' : 'text-white/50'}`}>
            3️⃣ Retrieve from IPFS
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Actions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">📝 Actions</h2>

            {/* Input Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-white block mb-2">Message:</label>
                <input
                  type="text"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter your message"
                  className="w-full p-3 rounded bg-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="text-white block mb-2">GIF URL:</label>
                <input
                  type="text"
                  value={formData.gifUrl}
                  onChange={(e) => setFormData({ ...formData, gifUrl: e.target.value })}
                  placeholder="https://example.com/image.gif"
                  className="w-full p-3 rounded bg-white/20 text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="text-white block mb-2">Upload File:</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="w-full p-3 rounded bg-white/20 text-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleUploadJSON}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading && step === 'uploading' ? '⏳ Uploading...' : '📤 Upload JSON to IPFS'}
              </button>

              <button
                onClick={handleUploadGifURL}
                disabled={loading || !formData.gifUrl}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? '⏳ Uploading...' : '🎨 Upload GIF URL to IPFS'}
              </button>

              <button
                onClick={handleRetrieveFromIPFS}
                disabled={loading || !ipfsResult}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
              >
                {loading && step === 'retrieving' ? '⏳ Retrieving...' : '🔍 Retrieve from IPFS'}
              </button>

              <button
                onClick={resetDemo}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                🔄 Reset Demo
              </button>
            </div>

            {/* IPFS Result */}
            {ipfsResult && (
              <div className="mt-6 p-4 bg-green-500/20 rounded-lg border border-green-500">
                <h3 className="text-white font-bold mb-2">✅ IPFS Upload Result:</h3>
                <div className="text-white text-sm space-y-1">
                  <p><strong>Hash (CID):</strong></p>
                  <p className="break-all bg-black/30 p-2 rounded">{ipfsResult.hash}</p>
                  <p><strong>URL:</strong></p>
                  <a 
                    href={ipfsResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-100 underline break-all"
                  >
                    {ipfsResult.url}
                  </a>
                </div>
              </div>
            )}

            {/* Retrieved Data */}
            {retrievedData && (
              <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500">
                <h3 className="text-white font-bold mb-2">📥 Retrieved Data:</h3>
                <pre className="text-white text-sm bg-black/30 p-4 rounded overflow-auto max-h-60">
                  {JSON.stringify(retrievedData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Right Panel - Logs */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">📋 Activity Logs</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-white/50 text-center py-8">No activity yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      log.type === 'error'
                        ? 'bg-red-500/20 border border-red-500'
                        : log.type === 'success'
                        ? 'bg-green-500/20 border border-green-500'
                        : 'bg-blue-500/20 border border-blue-500'
                    }`}
                  >
                    <div className="text-white/70 text-xs mb-1">{log.timestamp}</div>
                    <div className="text-white text-sm whitespace-pre-wrap break-all">
                      {log.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Data Flow Visualization */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🔄 Data Flow</h2>
          <div className="flex items-center justify-between text-white">
            <div className="text-center flex-1">
              <div className="text-4xl mb-2">💻</div>
              <div className="font-bold">Your Input</div>
              <div className="text-sm text-white/70">JSON / File</div>
            </div>
            
            <div className="text-4xl">→</div>
            
            <div className="text-center flex-1">
              <div className="text-4xl mb-2">🌐</div>
              <div className="font-bold">IPFS Network</div>
              <div className="text-sm text-white/70">Distributed Storage</div>
            </div>
            
            <div className="text-4xl">→</div>
            
            <div className="text-center flex-1">
              <div className="text-4xl mb-2">🔑</div>
              <div className="font-bold">CID (Hash)</div>
              <div className="text-sm text-white/70">Content Identifier</div>
            </div>
            
            <div className="text-4xl">→</div>
            
            <div className="text-center flex-1">
              <div className="text-4xl mb-2">⛓️</div>
              <div className="font-bold">Blockchain</div>
              <div className="text-sm text-white/70">Store CID Only</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPFSDemo;
