import { useRouter } from "next/router";
import { useEffect } from "react";



export default function ProfileIndex() {

}

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
    const response = await fetch(`${process.env.WEB_URL}/api/profile`, {
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
