import { useEffect, useState } from 'react';
import { Paper, Title, Grid, Card, Text, Select, TextInput, Button } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [parcels, setParcels] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchStats();
    fetchParcels();
  }, []);

  const fetchStats = async () => {
    const res = await fetch('http://localhost:3000/api/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStats(data);
  };

  const fetchParcels = async () => {
    const res = await fetch('http://localhost:3000/api/parcels', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setParcels(data);
  };

  const updateParcelStatus = async (id, status, location) => {
    await fetch(`http://localhost:3000/api/parcels/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, location })
    });
    fetchParcels();
    fetchStats();
  };

  return (
    <div>
      <Title order={2} mb="md">Admin Dashboard</Title>
      
      {stats && (
        <Grid mb="xl">
          <Grid.Col span={4}>
            <Card>
              <Text>Total Parcels: {stats.total}</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card>
              <Text>Pending: {stats.pending}</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card>
              <Text>Delivered: {stats.delivered}</Text>
            </Card>
          </Grid.Col>
        </Grid>
      )}

      <Paper p="md">
        <Title order={3} mb="md">Manage Parcels</Title>
        {parcels.map(parcel => (
          <Card key={parcel.id} mb="sm">
            <Grid>
              <Grid.Col span={3}>
                <Text>ID: {parcel.id}</Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Select
                  value={parcel.status}
                  onChange={(value) => updateParcelStatus(parcel.id, value, parcel.location)}
                  data={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'in_transit', label: 'In Transit' },
                    { value: 'delivered', label: 'Delivered' }
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  placeholder="Location"
                  value={parcel.location || ''}
                  onChange={(e) => updateParcelStatus(parcel.id, parcel.status, e.target.value)}
                />
              </Grid.Col>
            </Grid>
          </Card>
        ))}
      </Paper>
    </div>
  );
}
