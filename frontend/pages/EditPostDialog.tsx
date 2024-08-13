import React, { useState, useEffect } from 'react';

interface EditPostDialogProps {
    onClose: () => void;
    onEditPost: (postId: string, title: string, body: string) => void;
    postId: string;
    initialTitle: string;
    initialBody: string;
}

const EditPostDialog: React.FC<EditPostDialogProps> = ({ onClose, onEditPost, postId, initialTitle, initialBody }) => {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);

    useEffect(() => {
        setTitle(initialTitle);
        setBody(initialBody);
    }, [initialTitle, initialBody]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEditPost(postId, title, body);
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
                    <div
                        style={styles.textarea}
                        contentEditable
                        onInput={(e: any) => setBody(e.currentTarget.textContent)}
                    >
                        {body}
                    </div>
                    <div style={styles.buttonContainer}>
                        <button style={styles.button} type="submit">Save Changes</button>
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
        padding: '30px',
        borderRadius: '8px',
        width: '500px',
        maxHeight: '80vh',
        overflowY: 'auto' as const,
        textAlign: 'center' as const,
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    label: {
        color: '#FFFFFF',
        marginBottom: '12px',
        textAlign: 'left' as const,
    },
    input: {
        marginBottom: '20px',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #CCCCCC',
    },
    textarea: {
        marginBottom: '20px',
        padding: '12px',
        borderRadius: '4px',
        border: '1px solid #CCCCCC',
        minHeight: '200px',
        maxHeight: '400px',
        overflowY: 'auto' as const,
        backgroundColor: '#FFFFFF',
        color: '#000000',
        textAlign: 'left' as const,
        whiteSpace: 'pre-wrap' as const,
        wordWrap: 'break-word' as const,
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

export default EditPostDialog;
