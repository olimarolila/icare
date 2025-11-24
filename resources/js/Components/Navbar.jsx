import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Navbar({ auth }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 py-3 backdrop-blur-md bg-black/30 border-b border-[#7D7D7D]">
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <img
                            src="/images/logo_text.png"
                            alt="iCARE Logo"
                            className="h-10 md:h-10 object-contain cursor-pointer"
                        />
                    </Link>
                </div>
                <ul className="hidden md:flex items-center space-x-10 font-medium text-[1.2rem]">
                    <li><Link href={route('reports')} className="hover:text-yellow-400 transition-colors">Reports</Link></li>
                    <li><Link href={route('report.form')} className="hover:text-yellow-400 transition-colors">Report Form</Link></li>
                    <li><Link href={route('about')} className="hover:text-yellow-400 transition-colors">About</Link></li>
                </ul>
                <div className="hidden md:flex items-center space-x-8 font-semibold text-[1.2rem]">
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="hover:text-yellow-400 transition-colors">Dashboard</Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="hover:text-yellow-400 transition-colors">Log In</Link>
                            <Link href={route('register')} className="text-yellow-400 hover:text-yellow-300 transition-colors">Register</Link>
                        </>
                    )}
                </div>
                <button
                    className="md:hidden text-white hover:text-yellow-400 transition-colors"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </nav>
            <div
                className={`fixed top-[65px] left-0 w-full bg-black/80 backdrop-blur-md border-b border-[#7D7D7D] z-30 px-6 py-4 text-center font-medium text-[1rem] transition-all duration-500 ease-in-out transform ${
                    menuOpen ? 'opacity-100 translate-y-0 max-h-96' : 'opacity-0 -translate-y-5 max-h-0 overflow-hidden'
                }`}
            >
                <Link href={route('reports')} className="block py-1 hover:text-yellow-400 transition-colors">Reports</Link>
                <Link href={route('report.form')} className="block py-1 hover:text-yellow-400 transition-colors">Report Form</Link>
                <Link href={route('about')} className="block py-1 hover:text-yellow-400 transition-colors">About</Link>
                <div className="border-t border-gray-600 my-2" />
                {auth?.user ? (
                    <Link href={route('dashboard')} className="block py-1 hover:text-yellow-400 transition-colors">Dashboard</Link>
                ) : (
                    <>
                        <Link href={route('login')} className="block py-1 hover:text-yellow-400 transition-colors">Log In</Link>
                        <Link href={route('register')} className="block py-1 text-yellow-400 hover:text-yellow-300 transition-colors">Register</Link>
                    </>
                )}
            </div>
        </>
    );
}
