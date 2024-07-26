import Head from "next/head";
import Navbar from "@/components/navbar";
import StoryList from "@/components/stories/StoryList";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export default function Profile({ initialData }) {
    const router = useRouter();
    const [isFollow, setIsFollow] = useState(initialData.is_follow);
    const [followerCount, setFollowerCount] = useState(initialData.follower);
    const [storyContent, setStoryContent] = useState('');
    const [postError, setPostError] = useState(null);
    
    useEffect(() => {
        // Any additional side effects or data fetching can go here
    }, []);
    
    if (!initialData) {
        return <p>Loading...</p>;
    }

    async function onFollow() {
        const token = Cookies.get('jwt');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('/api/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    username: initialData.username,
                    status: !isFollow
                })
            });

            if (response.ok) {
                setIsFollow(prevState => !prevState);
                setFollowerCount(prevCount => isFollow ? prevCount - 1 : prevCount + 1);
            } else {
                console.error('Failed to follow/unfollow');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    async function onPostStory() {
        const token = Cookies.get('jwt');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('/api/stories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: storyContent })
            });

            if (response.ok) {
                const data = await response.json();
                setStoryContent(''); // Clear the input field
                // Optionally, refresh the list of stories or add the new story to the state
                console.log("Story posted successfully:", data);
            } else {
                setPostError('Failed to post story');
            }
        } catch (error) {
            setPostError('An error occurred while posting the story');
            console.error('An error occurred:', error);
        }
    }

    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content="User Profile" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />
            <div className="flex w-full flex-col">
                <div className="flex-1 flex items-center justify-center bg-black">
                    <div className="w-full lg:w-2/3 shadow-md min-h-screen mt-4">
                        {/* Profile Image */}
                        <div className="justify-center">
                            <div className="w-1/2 lg:w-1/5 md:w-1/4 border-8 border-green-500 mx-auto rounded-full overflow-hidden">
                                <img src={initialData.img_profile} alt={`${initialData.username}'s profile`} className="object-cover" />
                            </div>
                        </div>
                        <p className="text-center my-2 font-bold">{initialData.username}</p>
                        <div className="border border-zinc-900 shadow-md shadow-zinc-900 rounded-lg bg-zinc-900 p-4 m-4">
                            <div className="flex w-full flex-row">
                                <div className="flex flex-col items-center justify-center w-1/2">
                                    <span className="mx-auto text-xl">Follower</span>
                                    <span className="text font-bold text-xl" onClick={() => {router.push(`/follower/${initialData.username}`)}}>{followerCount}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center w-1/2">
                                    <span className="mx-auto text-xl">Following</span>
                                    <span className="text font-bold text-xl" onClick={() => {router.push(`/following/${initialData.username}`)}}>{initialData.following}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mx-4">
                            { initialData.is_same_user ? "" : 
                                <button    
                                    onClick={onFollow}
                                    className={`${isFollow ? 'bg-transparent border border-white' : 'bgFav'} w-full px-2 rounded-lg text-white font-bold`}>{isFollow ? "Unfollow" : "Follow"}</button>
                            }
                        </div>
                        
                        {/* Post Story Section */}
                        {initialData.is_same_user && (
                            <div className="mx-4 my-2 flex items-center">
                                <input
                                    type="text"
                                    placeholder="What's on your mind?"
                                    value={storyContent}
                                    onChange={(e) => setStoryContent(e.target.value)}
                                    className="flex-grow p-2 border border-gray-300 rounded-lg mr-2"
                                />
                                <button
                                    onClick={onPostStory}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Post
                                </button>
                            </div>
                        )}
                        {postError && <p className="text-red-500 text-center mt-2">{postError}</p>}
                        
                        <div className="border border-zinc-900 shadow-md shadow-zinc-900 rounded-lg bg-zinc-900 p-4 m-4">
                            <StoryList initialData={initialData}></StoryList>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { username } = context.params;
    const token = context.req.cookies.jwt || null;

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    try {
        const res = await fetch(`${process.env.WEB_URL}/api/profile/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            const data = await res.json();
            return { props: { initialData: data.data } };
        } else {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
}
