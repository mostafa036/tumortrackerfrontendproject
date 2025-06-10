import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { specialityData } from '../assets/assets';
import Chat from '../components/Chat';
import { useAuth } from '../context/AuthContext';

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChatDoctor, setActiveChatDoctor] = useState(null);
  const navigate = useNavigate();
  const { speciality } = useParams();
  const { user } = useAuth();
  const patientId = user?.id; // Get patient ID from user context

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://tumortraker12.runasp.net/api/Account/GetAllDoctors');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = speciality
    ? doctors.filter(doctor => doctor.type.toLowerCase() === speciality.toLowerCase())
    : doctors;

  const handleCloseChat = () => {
    setActiveChatDoctor(null);
  };

  if (loading) {
    return <div className="text-center p-4">Loading doctors...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Error: {error}</p>
        <button onClick={fetchDoctors} className="text-blue-600">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Doctor Card Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  {doctor.photoURL ? (
                    <img
                      src={doctor.photoURL}
                      alt={doctor.firstName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-indigo-600">
                      {doctor.firstName[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-indigo-600">{doctor.type}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {doctor.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Website:</span>{' '}
                  {doctor.websiteURL || 'Not provided'}
                </p>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Appointment Fee:</h3>
                  <span className="text-2xl font-bold text-blue-600">$50</span>
                </div>
                {user && (
                  <button
                    onClick={() => setActiveChatDoctor(doctor)}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-600 text-blue-600 hover:text-white py-3 rounded-lg transition-all duration-300 border-2 border-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat with Doctor
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/appointment?doctorId=${doctor.id}`)}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No doctors found {speciality ? `for ${speciality}` : ''}.
        </div>
      )}

      {/* Chat Window */}
      {activeChatDoctor && (
        <div className="fixed right-4 bottom-4 h-[500px] w-[350px] z-50">
          <Chat
            doctorId={activeChatDoctor.id}
            patientId={patientId}
            patientName={`${user?.firstName} ${user?.lastName}`}
            onClose={handleCloseChat}
          />
        </div>
      )}
    </div>
  );
};

export default Doctor;