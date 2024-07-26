import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import StoryItem from './StoryItem'; // Make sure to adjust the import path if needed
import { getSocket } from '@/socket';

const StoryList = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const socket = getSocket();

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('/api/stories/following', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}` // Or use any other method to get the token
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    const storiesFromAPI = data.data.flatMap(user => user.stories); // Flatten stories from each user
                    setStories(storiesFromAPI);
                } else {
                    console.error('Failed to fetch stories');
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();

        // Socket connection and event listeners
        const onConnect = () => {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        };

        const onDisconnect = () => {
            setIsConnected(false);
            setTransport("N/A");
        };

        const onNewStory = (data) => {
            setStories((prevStories) => {
                // Ensure no duplicates and keep the order
                const updatedStories = [data, ...prevStories];
                return updatedStories;
            });
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on('new-story', onNewStory);

        // Cleanup on unmount
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off('new-story', onNewStory);
        };
    }, [socket]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="story-list">
            {stories.map((story) => (
                <StoryItem
                    key={story._id}
                    imgProfile={story.img_profile}
                    username={story.username}
                    content={story.content}
                />
            ))}
        </div>
    );
};

export default StoryList;
