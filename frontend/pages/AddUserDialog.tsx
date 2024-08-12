import React, { useState } from 'react';

interface AddUserDialogProps {
  onClose: () => void;
  onAddUser: (email: string, password: string, nickname: string) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ onClose, onAddUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); // State for the nickname

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(email, password, nickname); // Include the nickname in the function call
    onClose();
  };

  return (
    <div style={dialogStyles.overlay}>
      <div style={dialogStyles.dialog}>
        <form style={dialogStyles.form} onSubmit={handleSubmit}>
          <label style={dialogStyles.label} htmlFor="email">Email:</label>
          <input
            style={dialogStyles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={dialogStyles.label} htmlFor="nickname">Nickname:</label>
          <input
            style={dialogStyles.input}
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          
          <label style={dialogStyles.label} htmlFor="password">Password:</label>
          <input
            style={dialogStyles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={dialogStyles.button} type="submit">Add User</button>
        </form>
        <button style={dialogStyles.cancelButton} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const dialogStyles = {
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
    zIndex: 1000,
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
  button: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    color: '#FFFFFF',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default AddUserDialog;
