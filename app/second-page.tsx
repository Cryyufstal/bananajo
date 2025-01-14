'use client';

import { useState, useEffect } from 'react';
import BottomNavigation from '@/components/BottomNavigation';

export default function SecondPage() {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // جلب البيانات من API
    fetch('/api/handler')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        return res.json();
      })
      .then((result) => {
        setData(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Second Page</h1>
      <p>Data from the server: {data}</p>
      <BottomNavigation />
    </div>
  );
}
