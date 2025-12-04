"use client"
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NavItems = () => {
    const NavItme = [
        { label: 'Home', href: '/' },
        { label: 'My Journey', href: '/my-journey' },
        { label: 'Companions', href: '/companions' },
        // {label:' Pricing', href:'/subscriptions'},
        { label: 'Sign In', href: '/sign-in' },
    ];

    const pathName = usePathname();

  return (
    <div className='flex items-center gap-4 '>
      {NavItme.map((item) => (       
        <Link key={item.label} href={item.href} className={cn(
            '',
            pathName === item.href ? 'text-primary font-semibold' : ''
        )}>
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default NavItems
