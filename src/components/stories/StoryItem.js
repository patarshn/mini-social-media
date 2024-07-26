import React from 'react';
import Link from 'next/link';

const StoryItem = ({ imgProfile, username, content }) => {
    return (
        <div className="story-item border p-4 mb-4 rounded-lg bg-gray-800">
            <div className="flex items-center">
                <img
                    src={'/profile.webp'}
                    alt={`${username}'s profile`}
                    className="w-12 h-12 rounded-full"
                />
                <div className="ml-3">
                    <h3 className="text-lg font-semibold text-white">
                            {username}
                    </h3>
                    <p className="text-gray-300">{content}</p>
                </div>
            </div>
        </div>
    );
};

export default StoryItem;
