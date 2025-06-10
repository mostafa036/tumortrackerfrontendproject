import React from 'react';
import { useNavigate } from 'react-router-dom';

const RiskFactors = () => {
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
          <h1 className="text-4xl font-bold mb-2 text-gray-900">RISK</h1>
          <h2 className="text-2xl font-light mb-2 text-indigo-600">FACTORS</h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Understanding Cancer Risk Factors
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Knowing the risk factors can help in prevention and early detection. Common risk factors include:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Genetics</h3>
              <p className="text-gray-600">
                Family history of cancer can increase your risk. Genetic counseling and testing can provide insights into your hereditary risks.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Lifestyle Choices</h3>
              <p className="text-gray-600">
                Smoking, excessive alcohol consumption, and poor diet are significant risk factors. Maintaining a healthy lifestyle can reduce your risk.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Environmental Factors</h3>
              <p className="text-gray-600">
                Exposure to harmful chemicals, radiation, and pollutants can increase cancer risk. Taking precautions in your environment can help mitigate these risks.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Age</h3>
              <p className="text-gray-600">
                The risk of cancer increases with age. Regular screenings become more important as you get older.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Health Conditions</h3>
              <p className="text-gray-600">
                Certain chronic conditions like obesity, diabetes, and inflammatory diseases can elevate cancer risk. Managing these conditions through medical care and lifestyle changes is crucial.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Infections</h3>
              <p className="text-gray-600">
                Some infections, such as human papillomavirus (HPV) and hepatitis, are linked to cancer. Vaccinations and regular medical check-ups can help prevent these infections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskFactors; 