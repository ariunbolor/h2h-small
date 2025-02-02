import { TextInput, Button, Paper, Text } from '@mantine/core';
import { useState } from 'react';

export default function Tracking() {
  const [trackingId, setTrackingId] = useState('');
  const [parcel, setParcel] = useState(null);

  const handleTrack = async () => {
    const res = await fetch(`http://localhost:3000/api/parcels/${trackingId}`);
    const data = await res.json();
    setParcel(data);
  };

  return (
    <Paper p="md">
      <TextInput
        label="Tracking ID"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
      />
      <Button onClick={handleTrack} mt="sm">Track Parcel</Button>
      
      {parcel && (
        <div mt="md">
          <Text>Status: {parcel.status}</Text>
          <Text>Location: {parcel.location}</Text>
        </div>
      )}
    </Paper>
  );
}
