'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Standup = {
	id: string
	user_email: string
	yesterday: string
	today: string
	blockers: string
	created_at: string
}

export default function DashboardPage() {
	const [standups, setStandups] = useState<Standup[]>([])
	const [userEmail, setUserEmail] = useState('')
	const router = useRouter()

	useEffect(() => {
		const getData = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) {
				router.push('/login')
				return
			}
			setUserEmail(user.email ?? '')

			const { data } = await supabase
				.from('standups')
				.select('*')
				.eq('user_email', user.email)
				.order('created_at', { ascending: false })

			setStandups(data ?? [])
		}
		getData()
	}, [])

	return (
		<main className="min-h-screen p-8 max-w-2xl mx-auto">
			<h1 className="text-3xl font-bold mb-2">Your Standups</h1>
			<p className="text-gray-500 mb-8">{userEmail}</p>

			{standups.length === 0 && <p>No standups yet.</p>}

			{standups.map((s) => (
				<div key={s.id} className="border rounded p-4 mb-4">
					<p className="text-sm text-gray-400 mb-2">
						{new Date(s.created_at).toLocaleDateString()}
					</p>
					<p><strong>Yesterday:</strong> {s.yesterday}</p>
					<p><strong>Today:</strong> {s.today}</p>
					<p><strong>Blockers:</strong> {s.blockers}</p>
				</div>
			))}
		</main>
	)
}