import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-black tracking-wide text-caliber-navy">
          CALIBER LODGING
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <Link href="/assessment">Start Assessment</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
