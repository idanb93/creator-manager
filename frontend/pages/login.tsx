import { FC, useState } from 'react';
import { useRouter } from 'next/router';

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login: Redirect to the homepage
        console.log('Login successful:', data);
        router.push('/homepage');
      } else if (response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="email">Email:</label>
          <input
            style={styles.input}
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={styles.label} htmlFor="password">Password:</label>
          <input
            style={styles.input}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} type="submit">Login</button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#F4F4F4',
  },
  box: {
    backgroundColor: '#272727',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'center' as const,
  },
  heading: {
    color: '#FFFFFF',
    marginBottom: '20px',
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
  },
  error: {
    color: '#FF0000',
    marginTop: '10px',
  },
};

export default Login;
