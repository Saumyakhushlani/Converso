import React from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white mt-auto py-6 px-4">
            <div className="max-w-[1400px] mx-auto px-14 max-sm:px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-gray-600">
                    <span>Built with</span>
                    <span className="text-red-500">❤️</span>
                    <span>by</span>
                    <span className="font-semibold text-gray-900">Saumya Khushlani</span>
                    <span className="hidden sm:inline">•</span>
                    <Link 
                        href="https://github.com/saumyakhushlani" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
