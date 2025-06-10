import React from 'react';
import { useNavigate } from 'react-router-dom';

const HowToDeal = () => {
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
          <h1 className="text-4xl font-bold mb-2 text-gray-900">HOW TO</h1>
          <h2 className="text-2xl font-light mb-2 text-indigo-600">DEAL</h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Coping with a Cancer Diagnosis
          </h2>
          <p className="text-lg mb-8 text-gray-600">
            Receiving a cancer diagnosis can be overwhelming. Here are some tips to help you cope:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl border-t-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Seek Support</h3>
              <p className="text-gray-600">
                Talk to family, friends, or join a support group. Sharing your feelings and experiences can provide emotional relief and practical advice.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-t-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Stay Informed</h3>
              <p className="text-gray-600">
                Learn about your diagnosis and treatment options. Knowledge can empower you to make informed decisions about your care.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-t-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Take Care of Yourself</h3>
              <p className="text-gray-600">
                Maintain a healthy diet, exercise regularly, and get plenty of rest. Physical well-being can positively impact your mental health.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-t-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Mental Health</h3>
              <p className="text-gray-600">
                Consider speaking with a counselor or therapist to manage stress and emotions. Techniques such as mindfulness, meditation, and relaxation exercises can also be beneficial.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-t-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Create a Plan</h3>
              <p className="text-gray-600">
                Work with your healthcare team to develop a treatment plan that fits your needs and lifestyle. Having a clear plan can reduce anxiety and provide a sense of control.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border-t-4 border-indigo-600">
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">Stay Positive</h3>
              <p className="text-gray-600">
                Focus on the aspects of your life that bring you joy and fulfillment. Maintaining a positive outlook can improve your overall well-being and resilience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToDeal; 