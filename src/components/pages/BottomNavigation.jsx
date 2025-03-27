import React from 'react'
import Link from 'next/link'
import {Home, BookOpen, HelpCircle, BarChart2, User} from 'lucide-react'
export default function BottomNavigation() {
  return (
<>
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 py-2 px-4">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center text-purple-800">
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/learn" className="flex flex-col items-center text-gray-500 hover:text-purple-800">
            <BookOpen size={24} />
            <span className="text-xs mt-1">Learn</span>
          </Link>
          <Link href="/quiz" className="flex flex-col items-center text-gray-500 hover:text-purple-800">
            <HelpCircle size={24} />
            <span className="text-xs mt-1">Quiz</span>
          </Link>
          <Link href="/stats" className="flex flex-col items-center text-gray-500 hover:text-purple-800">
            <BarChart2 size={24} />
            <span className="text-xs mt-1">Stats</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-purple-800">
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
</>
  )
}
