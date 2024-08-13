import React, { useEffect, useState } from 'react';
import styles from '../styles/Homepage.module.css';
import Post from './Post';
import { useRouter } from 'next/router';
import AddUserDialog from './AddUserDialog';
import AddPostDialog from './AddPostDialog';
import DeleteUsersDialog from './DeleteUsersDialog'; // Import the new component
import EditPostDialog from './EditPostDialog';

const Homepage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [showDeleteUsersDialog, setShowDeleteUsersDialog] = useState(false);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showAddPostDialog, setShowAddPostDialog] = useState(false);
    const [editPostData, setEditPostData] = useState<{ id: string, title: string, body: string } | null>(null);
    const [showEditPostDialog, setShowEditPostDialog] = useState(false);

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

    const handleAddUser = async (email: string, password: string, nickname: string) => {
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
                body: JSON.stringify({ email, password, nickname }),
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

    const handleEditPost = async (id : string, title: string, body: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/posts/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id, title, body }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Post updated successfully:', data);
                fetchPosts(); // Refresh the post list
            } else {
                console.error('Failed to update post:', response.statusText);
            }
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    const handleDeletePost = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/posts/delete?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                alert('Post deleted successfully');
                fetchPosts(); // Refresh the post list
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/delete?id=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert('User deleted successfully');
                fetchUsers(); // Refresh the user list
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    useEffect(() => {
        fetchPosts();
        fetchUsers(); // Fetch users initially to populate the dropdown
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
                <div className={styles.buttonContainer}>
                    <button className={styles.deleteUsers} onClick={() => setShowDeleteUsersDialog(true)}>
                        Delete Users
                    </button>
                    <button className={styles.addUsers} onClick={() => setShowAddUserDialog(true)}>
                        Add Users
                    </button>
                    <button className={styles.addPosts} onClick={() => setShowAddPostDialog(true)}>
                        Add Posts
                    </button>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Post
                            key={post.ID}
                            id={post.ID} 
                            topic={post.Title}
                            content={post.Body}
                            email={post.Email}
                            nickname={post.Nickname}
                            onDelete={handleDeletePost}
                            onEditPost={() => {
                            setEditPostData({ id: post.ID, title: post.Title, body: post.Body });
                            setShowEditPostDialog(true);
                            }}
                        />
                    ))}
                </div>
            </div>
            {showDeleteUsersDialog && (
                <DeleteUsersDialog
                    onClose={() => setShowDeleteUsersDialog(false)}
                    onDeleteUser={handleDeleteUser}
                    users={users.map(user => ({
                        id: user.ID,
                        email: user.Email,
                        Nickname: user.Nickname // Include nickname in user info passed to the dialog
                    }))}
                />
            )}
            {showAddUserDialog && (
                <AddUserDialog 
                    onClose={() => setShowAddUserDialog(false)}
                    onAddUser={handleAddUser} // Pass handleAddUser which now includes nickname
                />
            )}
            {showAddPostDialog && (
                <AddPostDialog 
                    onClose={() => setShowAddPostDialog(false)}
                    onAddPost={handleAddPost}
                />
            )}
            {showEditPostDialog && editPostData && (
                <EditPostDialog 
                    onClose={() => setShowEditPostDialog(false)}
                    onEditPost={handleEditPost}
                    initialTitle={editPostData.title}
                    initialBody={editPostData.body}
                    postId={editPostData.id}
                />
            )}
        </div>
    );
};

export default Homepage;
