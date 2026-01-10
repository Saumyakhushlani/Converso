"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavItems from './NavItems'
import { SignInButton,SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className='navbar relative'>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <div className='flex items-center gap-2.5 cursor-pointer'>
                    <Image src="/images/logo.svg" alt="logo" width={46} height={44} className='object-contain max-sm:w-8 max-sm:h-8'/>
                </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center gap-4'>
                <NavItems />
                <SignedOut>
                    <SignInButton>
                        <button className='btn-signin'>Sign In</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <div className='md:hidden flex items-center gap-2'>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className='absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50'>
                    <div className='flex flex-col p-4 gap-4'>
                        <NavItems mobile={true} onLinkClick={() => setIsMobileMenuOpen(false)} />
                        <SignedOut>
                            <SignInButton>
                                <button 
                                    className='btn-signin w-full justify-center'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
