import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">
        The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
        Go to Home
      </Link>
    </div>
  );
}
