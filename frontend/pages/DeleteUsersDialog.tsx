import React, { useState } from 'react';

interface DeleteUsersDialogProps {
  onClose: () => void;
  onDeleteUser: (userId: string) => void;
  users: { id: string; email: string; Nickname: string }[];
}

const DeleteUsersDialog: React.FC<DeleteUsersDialogProps> = ({ onClose, onDeleteUser, users }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleDelete = () => {
    if (selectedUserId) {
      onDeleteUser(selectedUserId);
      onClose();
    }
  };

  return (
    <div style={dialogStyles.overlay}>
      <div style={dialogStyles.dialog}>
        <h3 style={{ color: 'white' }}>Select User to Delete</h3>
        <select
          style={dialogStyles.select}
          value={selectedUserId || ''}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="" disabled>Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.Nickname ? `${user.Nickname} (${user.email})` : user.email}
            </option>
          ))}
        </select>
        <div style={dialogStyles.buttonContainer}>
          <button style={dialogStyles.confirmButton} onClick={handleDelete}>
            Confirm Delete
          </button>
          <button style={dialogStyles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
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
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '16px',
    borderRadius: '4px',
    border: '1px solid #CCCCCC',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  confirmButton: {
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
  },
};

export default DeleteUsersDialog;
