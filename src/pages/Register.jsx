import { TextInput, PasswordInput, Button, Paper, Title, Select, Stack } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'customer',
    full_name: '',
    phone: '',
    vehicle_number: '',
    license_number: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Registration failed');
      
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <Paper p="xl">
        <Title order={2} mb="md">Register</Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            
            <PasswordInput
              label="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <Select
              label="Role"
              required
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
              data={[
                { value: 'customer', label: 'Customer' },
                { value: 'driver', label: 'Driver' }
              ]}
            />

            <TextInput
              label="Full Name"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />

            <TextInput
              label="Phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            {formData.role === 'driver' && (
              <>
                <TextInput
                  label="Vehicle Number"
                  required
                  value={formData.vehicle_number}
                  onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                />

                <TextInput
                  label="License Number"
                  required
                  value={formData.license_number}
                  onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                />
              </>
            )}

            <Button type="submit" fullWidth mt="xl">
              Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}
