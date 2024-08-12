import React from 'react';
import styles from '../styles/Post.module.css';

interface PostProps {
    id: string;
    topic: string;
    content: string;
    nickname : string,
    onDelete: (id: string) => void;
}

const Post: React.FC<PostProps> = ({ id, topic, content, nickname, onDelete }) => {
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
            <button className={styles.deletePostButton} onClick={handleDelete}>
                Delete Post
            </button>
        </div>
    );
};

export default Post;
