import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AiTool = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Handle component mounting
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formatProbability = (value) => {
    if (typeof value !== 'number') return 'N/A';
    try {
      return (value * 100).toFixed(2) + '%';
    } catch (error) {
      console.error('Probability formatting error:', error);
      return 'N/A';
    }
  };

  const getHighestProbabilityClass = useCallback((results) => {
    if (!results || typeof results !== 'object') return 'N/A';
    try {
      const entries = Object.entries(results);
      if (entries.length === 0) return 'N/A';
      return entries.reduce((a, b) => (a[1] > b[1] ? a : b), ['N/A', 0])[0];
    } catch (error) {
      console.error('Error getting highest probability:', error);
      return 'N/A';
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      // First try the primary endpoint
      let response;
      try {
        response = await fetch('https://samxrashed-braintumorclassification.hf.space/predict', {
          method: 'POST',
          body: formData,
        });
      } catch (primaryError) {
        console.log('Primary endpoint failed, trying backup endpoint...');
        // If primary fails, try the backup endpoint
        response = await fetch('https://brain-tumor-detection-api.onrender.com/predict', {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from API');
      }

      // Transform the data if needed
      const processedData = {
        'No Tumor': data['No Tumor'] || 0,
        'Glioma': data['Glioma'] || 0,
        'Meningioma': data['Meningioma'] || 0,
        'Pituitary': data['Pituitary'] || 0
      };

      setResult(processedData);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult({ 
        error: 'Failed to analyze image. Please try again later. Error: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            AI Brain Tumor Detection
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a brain MRI scan to detect and classify potential tumors using advanced AI technology.
            Our system can identify Glioma, Meningioma, Pituitary tumors, or confirm No Tumor presence.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-90 transition-all duration-300 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-700 mb-4">
                Upload MRI Scan Image
              </label>
              
              <div 
                className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out
                  hover:border-indigo-500 hover:bg-indigo-50/30
                  group cursor-pointer relative"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <div className="flex flex-col items-center">
                    {previewUrl ? (
                      <div className="relative w-full max-w-md group">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-64 rounded-lg object-contain shadow-lg transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="transform transition-transform duration-300 group-hover:scale-110">
                          <svg
                            className="mx-auto h-16 w-16 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="mt-4">
                          <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300">
                            <span className="text-base">Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1 text-base text-gray-500 inline">or drag and drop</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!selectedImage || loading}
                className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-medium shadow-lg
                  transition-all duration-300 ease-in-out transform hover:-translate-y-1
                  ${!selectedImage || loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white'
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Image...
                  </>
                ) : (
                  'Analyze Image'
                )}
              </button>
            </div>
          </form>

          {/* Results Section */}
          {result && !result.error && (
            <div className="mt-8 p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Detection Result: {' '}
                    <span className={`${
                      getHighestProbabilityClass(result) === 'No Tumor' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {getHighestProbabilityClass(result)}
                    </span>
                  </h4>
                  
                  <div className="space-y-3">
                    {Object.entries(result).map(([type, probability]) => (
                      <div key={type} className="relative">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{type}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {formatProbability(probability)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${probability * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {getHighestProbabilityClass(result) !== 'No Tumor' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="font-semibold text-gray-900 mb-4">Recommendations</p>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Schedule an immediate consultation with a specialist
                      </li>
                      <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Bring your MRI scans and AI analysis results to your appointment
                      </li>
                      <li className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Consider getting a second opinion from another specialist
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {result && result.error && (
            <div className="mt-8 p-4 bg-red-50 rounded-xl text-red-600">
              {result.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiTool; 