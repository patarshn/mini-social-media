import Head from "next/head";
import Navbar from "@/components/navbar";
import StoryList from "@/components/stories/StoryList";

export default function Profile({ initialData }) {
    if (!initialData) {
        return <p>Loading...</p>;
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
                        <p className="text-center my-2">{initialData.username}</p>
                        <div className="border border-zinc-900 shadow-md shadow-zinc-900 rounded-lg bg-zinc-900 p-4 m-4">
                            <div className="flex w-full flex-row">
                                <div className="flex flex-col items-center justify-center w-1/2">
                                    <span className="mx-auto text-xl">Follower</span>
                                    <span className="text font-bold text-xl">{initialData.follower}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center w-1/2">
                                    <span className="mx-auto text-xl">Following</span>
                                    <span className="text font-bold text-xl">{initialData.following}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border border-zinc-900 shadow-md shadow-zinc-900 rounded-lg bg-zinc-900 p-4 m-4">
                            <StoryList></StoryList>
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
        const res = await fetch(`http://localhost:3000/api/profile/${username}`, {
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
