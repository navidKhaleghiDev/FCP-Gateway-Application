import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl font-semibold text-teal-500">404</p>
        <h1 className="mt-3 text-xl">صفحه پیدا نشد</h1>
        <Link
          className="mt-5 inline-block rounded-lg bg-teal-500 px-4 py-2 text-white"
          to={ROUTES.HOME}
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </main>
  );
}
