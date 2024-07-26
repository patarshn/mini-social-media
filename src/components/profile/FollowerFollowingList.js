import React from 'react';

const FollowerFollowingItem = ({ item }) => (
  <div className="flex items-center my-2">
    <img src={item.img_profile} alt={item.username} className="w-12 h-12 rounded-full mr-4" />
    <div>
      <p>{item.username}</p>
      <p className="text-gray-600">{item.email}</p>
    </div>
  </div>
);

export default FollowerFollowingItem;
