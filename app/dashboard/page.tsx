'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'

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
	const router = useRouter()

	useEffect(() => {
		const getData = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) {
				router.push('/login')
				return
			}

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
		<>
			<Navbar />
			<main className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-2xl font-bold mb-6">Past Standups</h1>

					{standups.length === 0 && (
						<p className="text-gray-500">No standups yet.</p>
					)}

					{standups.map((s) => (
						<div key={s.id} className="bg-white border rounded-xl p-6 mb-4 shadow-sm">
							<p className="text-xs text-gray-400 mb-3">
								{new Date(s.created_at).toLocaleDateString('en-IN', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</p>
							<div className="flex flex-col gap-2 text-sm">
								<p><span className="font-medium text-gray-700">Yesterday:</span> {s.yesterday}</p>
								<p><span className="font-medium text-gray-700">Today:</span> {s.today}</p>
								<p><span className="font-medium text-gray-700">Blockers:</span> {s.blockers}</p>
							</div>
						</div>
					))}
				</div>
			</main>
		</>
	)
}