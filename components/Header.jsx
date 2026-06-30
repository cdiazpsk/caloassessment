import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/caliber-logo.jpg"
            alt="Caliber Lodging"
            width={230}
            height={45}
            className="h-auto w-[190px] md:w-[230px]"
            priority
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <Link href="/assessment" className="hover:text-caliber-blue">Start Assessment</Link>
          <Link href="/admin" className="hover:text-caliber-blue">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
