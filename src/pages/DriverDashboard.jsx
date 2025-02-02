import { useEffect, useState } from 'react';
import { Paper, Title, Card, Text, Button, Select, Stack } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

export default function DriverDashboard() {
  const [assignments, setAssignments] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchAssignments();
    startLocationTracking();
  }, []);

  const fetchAssignments = async () => {
    const res = await fetch('http://localhost:3000/api/driver/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setAssignments(data);
  };

  const updateParcelStatus = async (parcelId, status) => {
    await fetch(`http://localhost:3000/api/driver/parcel/${parcelId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ 
        status,
        location: 'Current location' // You could use actual GPS coordinates here
      })
    });
    fetchAssignments();
  };

  const startLocationTracking = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(async (position) => {
        await fetch('http://localhost:3000/api/driver/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        });
      });
    }
  };

  return (
    <div>
      <Title order={2} mb="md">Driver Dashboard</Title>
      
      <Stack spacing="md">
        {assignments.map(parcel => (
          <Card key={parcel.id} shadow="sm">
            <Stack>
              <Text weight={500}>Parcel ID: {parcel.id}</Text>
              <Text>Pickup: {parcel.pickup_address}</Text>
              <Text>Delivery: {parcel.delivery_address}</Text>
              <Text>Status: {parcel.status}</Text>
              
              <Select
                label="Update Status"
                value={parcel.status}
                onChange={(value) => updateParcelStatus(parcel.id, value)}
                data={[
                  { value: 'picked_up', label: 'Picked Up' },
                  { value: 'in_transit', label: 'In Transit' },
                  { value: 'delivered', label: 'Delivered' }
                ]}
              />
            </Stack>
          </Card>
        ))}
      </Stack>
    </div>
  );
}
