import React from 'react';
import { useRouter } from 'next/router';

const FollowerFollowingItem = ({ item }) => {
  const router = useRouter();

  const handleItemClick = () => {
    router.push(`/profile/${item.username}`);
  };

  return (
    <div className="flex items-center my-2 cursor-pointer" onClick={handleItemClick}>
      <img src={item.img_profile} alt={item.username} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <p className="font-bold">{item.username}</p>
        <p className="text-gray-600">{item.email}</p>
      </div>
    </div>
  );
};

export default FollowerFollowingItem;
