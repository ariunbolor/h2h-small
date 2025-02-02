import { useState, useEffect } from 'react';
import { Table, Button, TextInput, Group, Paper } from '@mantine/core';

export default function Parcels() {
  const [parcels, setParcels] = useState([]);
  const [form, setForm] = useState({ sender: '', recipient: '' });

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    const res = await fetch('http://localhost:3000/api/parcels');
    const data = await res.json();
    setParcels(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/api/parcels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    fetchParcels();
    setForm({ sender: '', recipient: '' });
  };

  return (
    <div>
      <Paper p="md" mb="md">
        <form onSubmit={handleSubmit}>
          <Group>
            <TextInput
              label="Sender"
              value={form.sender}
              onChange={(e) => setForm({ ...form, sender: e.target.value })}
            />
            <TextInput
              label="Recipient"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            />
            <Button type="submit">Add Parcel</Button>
          </Group>
        </form>
      </Paper>

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Recipient</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map(parcel => (
            <tr key={parcel.id}>
              <td>{parcel.id}</td>
              <td>{parcel.sender}</td>
              <td>{parcel.recipient}</td>
              <td>{parcel.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
