import React, { useEffect, useState } from 'react';
import FollowerFollowingItem from '@/components/profile/FollowerFollowingItem';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';


const FollowerFollowingList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { username } = router.query;
  useEffect(() => {
    if (!username) return; 

    const fetchData = async () => {
      try {
        const token = Cookies.get('jwt');
        if (!token) {
          // If no token, redirect to login
          router.push('/login');
          return;
        }
        const response = await fetch(`/api/follower/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.error) {
          console.error(data.message);
        } else {
          setList(data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (list.length === 0) {
    return <p>No follower found.</p>;
  }

  return (
    <div>
      {list.map((item) => (
        <FollowerFollowingItem key={item._id} item={item} />
      ))}
    </div>
  );
};

export default FollowerFollowingList;