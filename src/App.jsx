import { useState } from 'react';
import { Container, Paper, Title, Button, TextInput, PasswordInput, Stack, Text } from '@mantine/core';

export default function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://bolor.me/h2h/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setResponse(data);
      console.log('Login response:', data);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://bolor.me/h2h/api/test.php');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const text = await res.text(); // First get the raw response
      console.log('Raw response:', text); // Log the raw response
      
      try {
        const data = JSON.parse(text); // Try to parse it
        setResponse(data);
        console.log('API test response:', data);
      } catch (e) {
        throw new Error('Invalid JSON response: ' + text);
      }
    } catch (error) {
      console.error('API test error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="sm" radius="md" p="xl">
        <Title order={2} mb="xl">Parcel Delivery System</Title>
        
        <Stack spacing="md">
          <Button 
            onClick={handleTestAPI} 
            color="blue" 
            mb="lg"
            loading={loading}
          >
            Test API Connection
          </Button>

          <form onSubmit={handleLogin}>
            <Stack spacing="md">
              <TextInput
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={loading}
              />
              
              <PasswordInput
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
              />
              
              <Button 
                type="submit" 
                color="green"
                loading={loading}
              >
                Login
              </Button>
            </Stack>
          </form>

          {error && (
            <Paper withBorder p="md" mt="md" color="red">
              <Text color="red">Error: {error}</Text>
            </Paper>
          )}

          {response && (
            <Paper withBorder p="md" mt="md">
              <Title order={4}>API Response:</Title>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
