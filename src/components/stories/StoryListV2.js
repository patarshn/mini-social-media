import React, { useState, useEffect } from 'react';
import StoryItem from './StoryItem';
import StoryPopup from './StoryPopup';
import { getSocket } from '@/socket';
import Cookies from 'js-cookie';

const StoryList = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [stories, setStories] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const socket = getSocket();

    useEffect(() => {
        const fetchStories = async () => {
            const token = Cookies.get('jwt');
            const response = await fetch('/api/stories/following',  {
                headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const data = await response.json();
            if (!data.error) {
                const groupedStories = data.data.reduce((acc, user) => {
                    acc[user.username] = user.stories;
                    return acc;
                }, {});
                setStories(groupedStories);
            }
        };

        fetchStories();

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on('new-story', (data) => {
            setStories((prevStories) => {
                const userStories = prevStories[data.username] || [];
                return {
                    ...prevStories,
                    [data.username]: [data, ...userStories]
                };
            });
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off('new-story');
        };
    }, [socket]);

    const handleShowPopup = (username) => {
        setSelectedUser(username);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedUser(null);
    };

    return (
        <div className="story-list">
            {Object.keys(stories).map((username) => (
                <div key={username} className="mb-4" onClick={() => handleShowPopup(username)}>
                    {stories[username].slice(0, 1).map((story) => (
                        <StoryItem
                            key={story._id}
                            imgProfile={story.img_profile}
                            username={story.username}
                            content={story.content}
                        />
                    ))}
                </div>
            ))}
            {showPopup && selectedUser && (
                <StoryPopup
                    stories={stories[selectedUser]}
                    username={selectedUser}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
};

export default StoryList;
