import { useState, useEffect, useCallback } from 'react';
import BottomNavigation from '@/components/BottomNavigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setError('Failed to fetch user data'));
  }, []);

  const handleIncreasePoints = useCallback(async () => {
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

  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  if (!user) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      <p>Your current points: {user.points}</p>
      <button
        onClick={handleIncreasePoints}
        disabled={isLoading}
        className={`${
          isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
        } text-white font-bold py-2 px-4 rounded mt-4`}
      >
        {isLoading ? 'Processing...' : 'Increase Points'}
      </button>
      {notification && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {notification}
        </div>
      )}
      <BottomNavigation />
    </div>
  );
}
