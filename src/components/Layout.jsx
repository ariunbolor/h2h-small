import { AppShell, Header, Navbar, Text } from '@mantine/core';
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          <Text size="xl">Parcel Delivery</Text>
        </Header>
      }
      navbar={
        <Navbar width={{ base: 200 }} p="xs">
          <Link to="/">Parcels</Link>
          <Link to="/track">Track</Link>
        </Navbar>
      }
    >
      <Outlet />
    </AppShell>
  );
}
