import { useState, useEffect } from 'react';
import RegistrationPage from './pages/Registrationpage/RegistrationPage';
import SuccessPage from './pages/Successpage/SuccessPage';

function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    return path === '/success' ? '/success' : '/registration';
  });
  const [registrationData, setRegistrationData] = useState(null);

  // Handle routing & protected /success route
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;

      if (path === '/success') {
        // Protected route: block direct public access if form wasn't submitted
        if (!registrationData) {
          window.history.replaceState(null, '', '/registration');
          setCurrentPath('/registration');
        } else {
          setCurrentPath('/success');
        }
      } else {
        if (path === '/' || path === '') {
          window.history.replaceState(null, '', '/registration');
        }
        setCurrentPath('/registration');
      }
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [registrationData]);

  const handleRegistrationSuccess = (data) => {
    setRegistrationData(data);
    setCurrentPath('/success');
    window.history.pushState(null, '', '/success');
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setRegistrationData(null);
    setCurrentPath('/registration');
    window.history.pushState(null, '', '/registration');
  };

  return (
    <main style={{ minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
      {currentPath === '/registration' && (
        <RegistrationPage onSuccess={handleRegistrationSuccess} />
      )}
      {currentPath === '/success' && registrationData && (
        <SuccessPage registrationData={registrationData} onReset={handleReset} />
      )}
    </main>
  );
}

export default App;

