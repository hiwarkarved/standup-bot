'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function StandupPage() {
	const [form, setForm] = useState({ yesterday: '', today: '', blockers: '' })
	const [submitted, setSubmitted] = useState(false)
	const [userEmail, setUserEmail] = useState('')
	const [summary, setSummary] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const getUser = async () => {
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) {
				router.push('/login')
			} else {
				setUserEmail(user.email ?? '')
			}
		}
		getUser()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		const { error } = await supabase.from('standups').insert({
			user_email: userEmail,
			yesterday: form.yesterday,
			today: form.today,
			blockers: form.blockers,
		})

		if (error) {
			alert('Error: ' + error.message)
			setLoading(false)
			return
		}

		const res = await fetch('/api/summarize', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		})
		const text = await res.text()
		const data = JSON.parse(text)
		setSummary(data.summary)

		await fetch('/api/send-email', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ to: userEmail, summary: data.summary }),
		})

		setLoading(false)
		setSubmitted(true)
	}

	if (submitted) {
		return (
			<>
				<Navbar />
				<main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
					<div className="bg-white border rounded-xl p-8 max-w-lg w-full shadow-sm text-center">
						<p className="text-2xl font-bold mb-4">Submitted! ✅</p>
						{summary && (
							<div className="bg-gray-50 border rounded-lg p-4 mb-6 text-left">
								<p className="text-xs font-bold text-gray-400 mb-2 uppercase">AI Summary</p>
								<p className="text-sm text-gray-700">{summary}</p>
							</div>
						)}
						<Link href="/dashboard" className="text-blue-600 text-sm hover:underline">
							View past standups →
						</Link>
					</div>
				</main>
			</>
		)
	}

	return (
		<>
			<Navbar />
			<main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
				<div className="bg-white border rounded-xl p-8 w-full max-w-lg shadow-sm">
					<h1 className="text-2xl font-bold mb-6">Daily Standup</h1>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div>
							<label className="text-sm font-medium text-gray-700 block mb-1">What did you do yesterday?</label>
							<textarea
								className="border rounded-lg p-3 w-full text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
								rows={3}
								value={form.yesterday}
								onChange={(e) => setForm({ ...form, yesterday: e.target.value })}
								required
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700 block mb-1">What will you do today?</label>
							<textarea
								className="border rounded-lg p-3 w-full text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
								rows={3}
								value={form.today}
								onChange={(e) => setForm({ ...form, today: e.target.value })}
								required
							/>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-700 block mb-1">Any blockers?</label>
							<textarea
								className="border rounded-lg p-3 w-full text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
								rows={2}
								value={form.blockers}
								onChange={(e) => setForm({ ...form, blockers: e.target.value })}
								required
							/>
						</div>
						<button
							type="submit"
							disabled={loading}
							className="bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
						>
							{loading ? 'Submitting...' : 'Submit Standup'}
						</button>
					</form>
				</div>
			</main>
		</>
	)
}