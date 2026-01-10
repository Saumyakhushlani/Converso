"use client"
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SignedIn } from '@clerk/nextjs';
import Image from 'next/image';

interface NavItemsProps {
    mobile?: boolean;
    onLinkClick?: () => void;
}

const NavItems = ({ mobile = false, onLinkClick }: NavItemsProps) => {
    const pathName = usePathname();

    const publicNavItems = [
        { label: 'Home', href: '/' },
        { label: 'Companions', href: '/companions' },
        { label: 'Pricing', href: '/subscription' },
    ];

  return (
    <div className={cn(
        'flex items-center gap-4',
        mobile ? 'flex-col items-stretch w-full' : ''
    )}>
      {/* Public navigation items - always visible */}
      {publicNavItems.map((item) => (       
        <Link 
            key={item.label} 
            href={item.href} 
            onClick={onLinkClick}
            className={cn(
                mobile ? 'py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors' : '',
                pathName === item.href ? 'text-primary font-semibold' : ''
            )}
        >
          {item.label}
        </Link>
      ))}
      
      {/* Authenticated-only navigation items */}
      <SignedIn>
        <Link 
          href="/my-journey" 
          onClick={onLinkClick}
          className={cn(
            mobile ? 'py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors' : '',
            pathName === '/my-journey' ? 'text-primary font-semibold' : ''
          )}
        >
          My Journey
        </Link>
        
        <Link 
          href="/companions/new" 
          onClick={onLinkClick}
          className={cn(
            'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors',
            mobile ? 'w-full' : '',
            pathName === '/companions/new' ? 'bg-primary/90' : ''
          )}
        >
          <Image src="/icons/plus.svg" alt="plus" width={16} height={16} />
          <span>Add Companion</span>
        </Link>
      </SignedIn>
    </div>
  )
}

export default NavItems
