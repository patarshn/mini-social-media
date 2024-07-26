import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import StoryItem from './StoryItem'; // Make sure to adjust the import path if needed
import { getSocket } from '@/socket';
import Cookies from 'js-cookie';

const StoryList = ({initialData}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const socket = getSocket();

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const token = Cookies.get('jwt');
                const urlByFollowing = "/api/stories/following"
                let url = `/api/stories/${initialData.username}`; //default by username
                if (initialData.is_same_user){
                    url = urlByFollowing 
                }
                
                console.log("fetchStory Using:", url, initialData)
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${token}` // Or use any other method to get the token
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    let storiesFromAPI = {}
                    if(initialData.is_same_user){
                        storiesFromAPI = data.data.flatMap(user => user.stories);
                    }else{
                        storiesFromAPI = data.data
                    }
                    
                    console.log(storiesFromAPI)
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
        const userId = localStorage.getItem('id')
        console.log(userId);
        socket.emit("register", userId)

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
