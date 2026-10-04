'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
	const handleGoogleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/standup`,
			},
		})
	}

	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
			<div className="bg-white border rounded-xl p-10 flex flex-col items-center gap-6 shadow-sm w-full max-w-sm">
				<h1 className="text-2xl font-bold">StandupBot</h1>
				<p className="text-gray-500 text-sm text-center">
					Daily standups, simplified. Sign in to get started.
				</p>
				<button
					onClick={handleGoogleLogin}
					className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
				>
					Sign in with Google
				</button>
			</div>
		</main>
	)
}