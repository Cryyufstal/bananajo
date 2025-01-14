import { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';

export default function SecondPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/second-page-data')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch(() => setError('Failed to fetch data'));
  }, []);

  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  if (!data) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Second Page</h1>
      <p>Data from the server: {JSON.stringify(data)}</p>
      <BottomNavigation />
    </div>
  );
}
