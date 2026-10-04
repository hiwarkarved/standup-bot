'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
	const [email, setEmail] = useState('')
	const router = useRouter()

	useEffect(() => {
		const getUser = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			if (user) setEmail(user.email ?? '')
		}
		getUser()
	}, [])

	const handleSignOut = async () => {
		await supabase.auth.signOut()
		router.push('/login')
	}

	return (
		<nav className="border-b px-8 py-4 flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
			<Link href="/standup" className="font-bold text-lg tracking-tight">StandupBot</Link>
			<div className="flex items-center gap-6">
				<Link href="/standup" className="text-sm text-gray-600 hover:text-black">New Standup</Link>
				<Link href="/dashboard" className="text-sm text-gray-600 hover:text-black">Dashboard</Link>
				{email && <span className="text-sm text-gray-400">{email}</span>}
				{email && (
					<button onClick={handleSignOut} className="text-sm text-red-500 hover:text-red-700">
						Sign out
					</button>
				)}
			</div>
		</nav>
	)
}