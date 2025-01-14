import Link from 'next/link';

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-around">
      <Link href="/" className="text-lg font-bold hover:underline">
        Home
      </Link>
      <Link href="/second-page" className="text-lg font-bold hover:underline">
        Second Page
      </Link>
    </div>
  );
}
