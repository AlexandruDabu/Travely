import React, { useCallback, useEffect, useRef, useState } from 'react';
import axiosClient from '../../app/services/axiosClient';
import LoadingSpinner from '../../app/layout/LoadingSpinner';
import UsersCard from '../Cards/UsersCard';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    imageurl: string;
    bio: string;
    country: string;
    city: string;
    travelsNumber: string;
}

export default function DiscoverPeople() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadData = async () => {
            if (loading) return;

            try {
                const userData = await axiosClient.get(`/auth/limitedUsers/${page}`, { 
                    params: { searchTerm },
                    withCredentials: true 
                });
                const newData = userData.data.data;
                const isSameData = JSON.stringify(newData) === JSON.stringify(users);

                if(!isSameData){
                    if (page === 1) {
                        setUsers(userData.data.data);
                    } else {
                        setUsers(prevData => [...prevData, ...userData.data.data]);
                    }
                }
                setHasMore(newData.length > 0);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [page, searchTerm]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore && !loading) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    const handleSearchTermChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); 
        setHasMore(true);
    }, []);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [hasMore, loading]);

    if (loading && page === 1) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="my-4 flex justify-center">
                <input
                    type="text"
                    placeholder="Search for people..."
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    ref={searchInputRef}
                    className="w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                />
            </div>
            <div>
                {users.length > 0 ? (  
                    users.map((user: User) => 
                        <UsersCard key={user.id} user={user} />
                    )
                ) : (
                    <h1
                        className="text-center text-2xl font-semibold text-gray-500 mt-10"
                        style={{ fontFamily: "'Roboto', sans-serif", opacity: 0.7 }}
                    >
                        No user with such name
                    </h1>
                )}
            </div>  
            {loading && page > 1 && (
                <div className='flex justify-center mt-4'>
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
}
