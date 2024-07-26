import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleClear = () => {
        setSearchQuery('');
        setIsSearching(false);
        setSearchResults([]);
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const token = Cookies.get('jwt');

        try {
            const response = await fetch(`/api/search/${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.data);
            } else {
                console.error('Failed to fetch search results:', response.statusText);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
        }
    };

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a href={`/profile`}>Profile</a></li>
                        <li><a href={`/logout`}>Logout</a></li>
                    </ul>
                </div>
                <a className="text-xl md:hidden block">IoHub</a>
            </div>
            <div className="navbar-center">
                <a className="text-xl hidden md:block">IoHub</a>
            </div>
            <div className="navbar-end">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                            onClick={isSearching ? handleClear : null}
                            className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isSearching ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            )}
                        </svg>
                        <span className="sr-only">{isSearching ? 'Clear search' : 'Search icon'}</span>
                    </div>
                    <input
                        type="text"
                        id="search-navbar"
                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                        onFocus={() => { setIsSearching(true); }}
                    />
                    {searchResults.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 mt-2 shadow-md z-10 max-h-56 overflow-y-auto rounded-md">
                            {searchResults.map((user) => (
                                <li key={user.username} className="p-2 border-b border-gray-200 bg-black">
                                    <a href={`/profile/${user.username}`}>
                                        <div className="flex items-center">
                                            <img src={user.img_profile} alt={user.username} className="w-8 h-8 rounded-full mr-2" />
                                            <span>{user.username}</span>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
