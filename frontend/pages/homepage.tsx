import React, { useEffect, useState } from 'react';
import styles from '../styles/Homepage.module.css';
import Post from './Post';
import { useRouter } from 'next/router';

const Homepage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const handleLogout = () => {
      // Redirect to the login page
      router.push('http://localhost:3000/login');
    };

    return (
        <div className={styles.container} style={{ backgroundImage: 'url("/laptop-desk.jpg")' }}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>Symbio</div>
                <button className={styles.logoutButton} onClick={() => { 
                  handleLogout()
                 }}>Log Out</button>
            </nav>
            <div className={styles.sidebar}>
                <h2>Welcome to the Platform</h2>
                <p>This platform provides articles and updates on various topics related to prominent tech figures.</p>
                <h3>Topics</h3>
                <ul>
                    <li>Bill Gates</li>
                    <li>Elon Musk</li>
                    <li>Mark Zuckerberg</li>
                    <li>Marcus Hutchins</li>
                    <li>George Hotz</li>
                </ul>
            </div>
            <div className={styles.content}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Post
                            key={post.ID}
                            topic={post.Title}
                            content={post.Body}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
