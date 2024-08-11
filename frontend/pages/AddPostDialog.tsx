import React, { useState } from 'react';

interface AddPostDialogProps {
    onClose: () => void;
    onAddPost: (title: string, body: string) => void;
}

const AddPostDialog: React.FC<AddPostDialogProps> = ({ onClose, onAddPost }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPost(title, body);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.dialog}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label} htmlFor="title">Title:</label>
                    <input
                        style={styles.input}
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label style={styles.label} htmlFor="body">Body:</label>
                    <textarea
                        style={styles.textarea}
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    />
                    <div style={styles.buttonContainer}>
                        <button style={styles.button} type="submit">Add Post</button>
                        <button style={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: '#272727',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        textAlign: 'center' as const,
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    label: {
        color: '#FFFFFF',
        marginBottom: '8px',
        textAlign: 'left' as const,
    },
    input: {
        marginBottom: '16px',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #CCCCCC',
    },
    textarea: {
        marginBottom: '16px',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #CCCCCC',
        minHeight: '100px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: '#FFFFFF',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
        color: '#FFFFFF',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
      }
};

export default AddPostDialog;
