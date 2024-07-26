import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // Clear the JWT cookie
    Cookies.remove('jwt');

    // Optionally, clear any other user data stored in localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('email');

    // Redirect to the login page
    router.push('/login');
  }, [router]);

  return null; // No UI needed, as this component is purely for the logout process
};

export default Logout;
