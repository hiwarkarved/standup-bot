'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function StandupPage() {
	const [form, setForm] = useState({ yesterday: '', today: '', blockers: '' });
	const [submitted, setSubmitted] = useState(false);
	const [userEmail, setUserEmail] = useState('');
	const router = useRouter();
	const [summary, setSummary] = useState('')

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) {
				router.push('/login');
			} else {
				setUserEmail(user.email ?? '');
			}
		};
		getUser();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Save to Supabase
		const { error } = await supabase.from('standups').insert({
			user_email: userEmail,
			yesterday: form.yesterday,
			today: form.today,
			blockers: form.blockers,
		});

		if (error) {
			alert('Error: ' + error.message);
			return;
		}

		// Get AI summary
		const res = await fetch('/api/summarize', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		});
		const text = await res.text()
		console.log(text)
		const data = JSON.parse(text)
		setSummary(data.summary);
		// Send email
		await fetch('/api/send-email', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			to: userEmail,
			summary: data.summary,
		}),
		})
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<main className="min-h-screen flex flex-col items-center justify-center p-8">
				<p className="text-2xl font-bold mb-4">Standup submitted! ✅</p>
				{summary && (
					<div className="max-w-lg bg-gray-50 border rounded p-4">
						<p className="text-sm font-bold text-gray-500 mb-2">AI Summary</p>
						<p>{summary}</p>
					</div>
				)}
				<a href="/dashboard" className="text-blue-600 underline">
				View past standups →
			</a>
			</main>
		);
	}

	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-8">
			<h1 className="text-3xl font-bold mb-2">Daily Standup</h1>
			{userEmail && <p className="text-gray-500 mb-6">{userEmail}</p>}
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full max-w-lg"
			>
				<textarea
					placeholder="What did you do yesterday?"
					className="border p-3 rounded"
					value={form.yesterday}
					onChange={(e) => setForm({ ...form, yesterday: e.target.value })}
					required
				/>
				<textarea
					placeholder="What will you do today?"
					className="border p-3 rounded"
					value={form.today}
					onChange={(e) => setForm({ ...form, today: e.target.value })}
					required
				/>
				<textarea
					placeholder="Any blockers?"
					className="border p-3 rounded"
					value={form.blockers}
					onChange={(e) => setForm({ ...form, blockers: e.target.value })}
					required
				/>
				<button
					type="submit"
					className="bg-black text-white py-3 rounded font-bold"
				>
					Submit Standup
				</button>
			</form>
		</main>
	);
}
