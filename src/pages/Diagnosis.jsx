import React from 'react';
import { useNavigate } from 'react-router-dom';

const Diagnosis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/for-you')}
          className="flex items-center text-indigo-600 mb-6 hover:text-indigo-700 transition-colors"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">DIAGNOSIS</h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Early Detection and Diagnosis
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Detecting cancer early can significantly improve the chances of successful treatment. Our advanced imaging tool uses state-of-the-art technology to identify abnormal growths and potential cancerous cells with high accuracy. The process involves:
          </p>

          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Initial Screening</h3>
              <p className="text-gray-600">
                Non-invasive imaging scans to detect any anomalies. These scans are quick and painless, providing detailed images of the body's internal structures.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Detailed Analysis</h3>
              <p className="text-gray-600">
                High-resolution images are analyzed by our expert radiologists who look for any signs of cancer. This step is crucial as it helps in identifying even the smallest abnormalities that might be missed by other methods.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Follow-Up Tests</h3>
              <p className="text-gray-600">
                If necessary, additional tests such as biopsies or blood work are conducted to confirm the diagnosis. This comprehensive approach ensures accuracy in the detection process.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Personalized Reports</h3>
              <p className="text-gray-600">
                Patients receive a detailed report explaining the findings, potential diagnosis, and recommended next steps. This report is designed to be easy to understand, providing clarity and peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis; 