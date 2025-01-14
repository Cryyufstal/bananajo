'use client';

import { useEffect, useState, useCallback } from 'react';
import { WebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

interface Task {
  id: number;
  title: string;
  url: string;
  status: 'pending' | 'completed';
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Task 1', url: 'https://example.com', status: 'pending' },
    { id: 2, title: 'Task 2', url: 'https://example2.com', status: 'pending' },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data);
            }
          })
          .catch(() => {
            setError('Failed to fetch user data');
          });
      } else {
        setError('No user data available');
      }
    } else {
      setError('This app should be opened in Telegram');
    }
  }, []);

  const handleIncreasePoints = useCallback(async (taskId: number) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId }),
      });
      const data = await res.json();

      if (data.success) {
        setUser((prevUser: any) => ({ ...prevUser, points: data.points }));
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setNotification('Points increased successfully!');
        setTimeout(() => setNotification(''), 3000);
      } else {
        setError('Failed to increase points');
      }
    } catch {
      setError('An error occurred while increasing points');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleTaskAction = (task: Task) => {
    if (task.status === 'pending') {
      // افتح الرابط الخارجي
      window.open(task.url, '_blank');
      // حدث حالة المهمة إلى "Check"
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, status: 'completed' } : t
        )
      );
    } else if (task.status === 'completed') {
      handleIncreasePoints(task.id);
    }
  };

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      <p>Your current points: {user.points}</p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-2">
              <div className="flex items-center justify-between">
                <span>{task.title}</span>
                <button
                  onClick={() => handleTaskAction(task)}
                  disabled={isLoading && task.status === 'completed'}
                  className={`${
                    task.status === 'pending'
                      ? 'bg-blue-500 hover:bg-blue-700'
                      : 'bg-green-500 hover:bg-green-700'
                  } text-white font-bold py-1 px-3 rounded`}
                >
                  {task.status === 'pending' ? 'Start' : 'Check'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {notification && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {notification}
        </div>
      )}
    </div>
  );
}
