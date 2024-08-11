import React from 'react';
import styles from '../styles/Post.module.css';

interface PostProps {
    topic: string;
    content: string;
}

const Post: React.FC<PostProps> = ({ topic, content }) => {
    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <span className={styles.postTopic}>{topic}</span>
            </div>
            <p>{content}</p>
        </div>
    );
};

export default Post;
