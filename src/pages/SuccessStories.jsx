import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessStories = () => {
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
          <h1 className="text-4xl font-bold mb-2 text-gray-900">SUCCESS</h1>
          <h2 className="text-2xl font-light mb-2 text-indigo-600">STORIES</h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Real Stories, Real Success
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Our tool has helped countless individuals detect cancer early and start their journey towards recovery. Here are a few inspiring stories:
          </p>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">John's Journey</h3>
              <p className="text-gray-600">
                Diagnosed with early-stage lung cancer, John underwent successful treatment and is now cancer-free. His story highlights the importance of regular screenings and early detection.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Emily's Experience</h3>
              <p className="text-gray-600">
                Our tool detected a small tumor in Emily's breast during a routine check-up. Early intervention allowed her to undergo a less invasive treatment, leading to a full recovery. Emily now advocates for regular screenings among her friends and family.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Michael's Miracle</h3>
              <p className="text-gray-600">
                After a routine scan, Michael discovered he had brain cancer. Thanks to early detection, he received timely treatment and is now in remission. Michael's story is a testament to the life-saving potential of our imaging tool.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Sophia's Strength</h3>
              <p className="text-gray-600">
                Sophia was diagnosed with ovarian cancer at an early stage. With the help of our tool, her doctors were able to create a personalized treatment plan that led to her successful recovery. Sophia now volunteers to support other cancer patients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories; 