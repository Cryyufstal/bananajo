import Link from 'next/link';

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-500 p-4 text-white flex justify-around">
      <Link href="/" className="text-center">Home</Link>
      <Link href="/tasks/task" className="text-center">Tasks</Link> {/* الرابط إلى صفحة Tasks */}
    </div>
  );
}
