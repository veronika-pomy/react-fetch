import React, { useState, useEffect, useRef } from 'react';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const Fetch = () => {

    const [ isLoading, setLoading ] = useState(false);
    const [ error, setError ] = useState();
    const [ posts, setPosts ] = useState([]);
    const [ page, setPage ] = useState(0);

    // abort prev fetch request, if needed to handle race conditons
    const abortControllerRef = useRef(null);

    // fetching functionality
    useEffect(() => {
        
        // fetching function 
        const fetchPosts = async () => {

            // check prev request and abort, if needed
            abortControllerRef.current?.abort();
            // set new ref
            abortControllerRef.current = new AbortController();

            // loading
            setLoading(true);
            try {
                // fetch
                const response = await fetch(`${BASE_URL}/posts?page=${page}`, {
                    signal: abortControllerRef.current?.signal,
                });
                // format data for manipulation
                const posts = await response.json();
                // set posts state
                setPosts(posts);
            } catch (e) {
                // cancel error if it's about error
                if(e.name === 'AbortError') {
                    console.log('Request aborted.');
                    return;
                } 
                // handle other errors
                setError(e);
            } finally {
                setLoading(false);
            };
        };

        // call fetch posts
        fetchPosts();

    }, [ page ]);
    // added dependency for pagination, to fire useEffect any time page changes, not just once on mount

    if(error) return <div>Someting went wrong, please try again.</div>

    return (
        <div>
            <h1>Fetch Data in React</h1>
            <button onClick={() => setPage(page + 1)}>Next Page ({page})</button>
            <ul>
                {isLoading ? <div>Loading...</div>
                :
                posts.map((post) => <li key={post.id}>{post.title}</li>)}
            </ul>
        </div>
    )
};

export default Fetch;