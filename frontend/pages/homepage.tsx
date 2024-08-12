import React, { useEffect, useState } from 'react';
import styles from '../styles/Homepage.module.css';
import Post from './Post';
import { useRouter } from 'next/router';
import AddUserDialog from './AddUserDialog';
import AddPostDialog from './AddPostDialog';

const Homepage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showAddPostDialog, setShowAddPostDialog] = useState(false);

    const router = useRouter();

    const fetchPosts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            } else {
                console.error('Failed to fetch posts:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleDeleteUsers = () => {
        fetchUsers();
        setShowDropdown(!showDropdown);
    };

    const handleAddUser = async (email: string, password: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User added successfully:', data);
                fetchUsers(); // Refresh the user list
            } else {
                console.error('Failed to add user:', response.statusText);
            }
        } catch (err) {
            console.error('Error adding user:', err);
        }
    };

    const handleAddPost = async (title: string, body: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, body }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Post added successfully:', data);
                fetchPosts(); // Refresh the post list
            } else {
                console.error('Failed to add post:', response.statusText);
            }
        } catch (err) {
            console.error('Error adding post:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleUserSelect = (userId: string) => {
        setSelectedUserId(userId);
    };

    const handleDeleteUser = async () => {
        if (!selectedUserId) return;

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/delete?id=${selectedUserId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('User deleted successfully');
                fetchUsers();
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        }

        setShowDropdown(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className={styles.container} style={{ backgroundImage: 'url("/laptop-desk.jpg")' }}>
            <nav className={styles.navbar}>
                <div className={styles.logo}>Symbio</div>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Log Out
                </button>
            </nav>
            <div className={styles.sidebar}>
                <button className={styles.deleteUsers} onClick={handleDeleteUsers}>
                    Delete Users
                </button>
                <button className={styles.addUsers} onClick={() => setShowAddUserDialog(true)}>
                    Add Users
                </button>
                <button className={styles.addPosts} onClick={() => setShowAddPostDialog(true)}>
                    Add Posts
                </button>
                {showDropdown && (
                    <div className={styles.dropdownContainer}>
                        <div className={styles.dropdownMenu}>
                            <ul>
                                {users.map(user => (
                                    <li
                                        key={user.ID}
                                        onClick={() => handleUserSelect(user.ID)}
                                        className={selectedUserId === user.ID ? styles.selectedUser : ''}
                                    >
                                        {user.Email}
                                    </li>
                                ))}
                            </ul>
                            <button className={styles.confirmDeleteButton} onClick={handleDeleteUser}>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                )}
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
            {showAddUserDialog && (
                <AddUserDialog 
                    onClose={() => setShowAddUserDialog(false)}
                    onAddUser={handleAddUser}
                />
            )}
            {showAddPostDialog && (
                <AddPostDialog 
                    onClose={() => setShowAddPostDialog(false)}
                    onAddPost={handleAddPost}
                />
            )}
        </div>
    );
};

export default Homepage;
