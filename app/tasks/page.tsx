'use client';

import { useEffect, useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => setError('Failed to fetch tasks data'));
  }, []);

  const handleTaskAction = async (task: any) => {
    if (task.status === 'pending') {
      // Open external link
      window.open(task.url, '_blank');

      // Update task status
      const updatedTask = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: 'completed' }),
      }).then((res) => res.json());

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
    }
  };

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!tasks.length) {
    return <div className="container mx-auto p-4">No tasks available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-4 flex justify-between items-center">
            <span>{task.title}</span>
            <button
              onClick={() => handleTaskAction(task)}
              className={`${
                task.status === 'pending'
                  ? 'bg-blue-500 hover:bg-blue-700'
                  : 'bg-gray-500 cursor-not-allowed'
              } text-white font-bold py-1 px-3 rounded`}
              disabled={task.status !== 'pending'}
            >
              {task.status === 'pending' ? 'Start' : 'Completed'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
