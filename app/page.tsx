'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setUser(data);
      })
      .catch(() => setError('Failed to fetch user data'));

    // Fetch tasks data
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => setError('Failed to fetch tasks data'));
  }, []);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!user || !tasks) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      <p>Your current points: {user.points}</p>

      <button
        onClick={() => router.push('/tasks')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        View Tasks
      </button>
    </div>
  );
}
