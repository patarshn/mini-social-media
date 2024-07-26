import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirecting if needed (optional)
    // This can be used if you want additional checks on the client side
  }, []);

  return null; // Empty component as the redirection is handled on the server side
};

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.jwt || null;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch(`${process.env.API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();

    return {
      redirect: {
        destination: `/profile/${data.data.username}`,
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Error fetching profile:', error);

    // Redirect to login if there is an error fetching the profile
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}

export default Home;
