import React from 'react';
import styles from '../styles/Post.module.css';

interface PostProps {
    id: string;
    topic: string;
    content: string;
    email : string
    nickname : string,
    onDelete: (id: string) => void;
}

const Post: React.FC<PostProps> = ({ id, topic, content, email, nickname, onDelete }) => {
    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <span className={styles.postTopic}>{topic}</span>
            </div>
            <div className={styles.postNickname}>{nickname}</div>
            <p>{content}</p>
            <div className={styles.postButtonsContainer}>
                <button className={styles.deletePostButton} onClick={handleDelete}>
                    Delete Post
                </button>
                <button className={styles.editPostButton} onClick={handleDelete}>
                    Edit Post
                </button>
            </div>
        </div>
    );
};

export default Post;
