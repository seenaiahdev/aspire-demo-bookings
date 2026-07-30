import { useState } from 'react';
import RegistrationPage from './pages/Registrationpage/RegistrationPage';
import SuccessPage from './pages/Successpage/SuccessPage';

function App() {
  const [currentPage, setCurrentPage] = useState('registration');
  const [registrationData, setRegistrationData] = useState(null);

  const handleRegistrationSuccess = (data) => {
    setRegistrationData(data);
    setCurrentPage('success');
  };

  const handleReset = () => {
    setRegistrationData(null);
    setCurrentPage('registration');
  };

  return (
    <main style={{ minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      {currentPage === 'registration' && (
        <RegistrationPage onSuccess={handleRegistrationSuccess} />
      )}
      {currentPage === 'success' && (
        <SuccessPage registrationData={registrationData} onReset={handleReset} />
      )}
    </main>
  );
}

export default App;
