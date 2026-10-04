'use client';

import { supabase } from '@/lib/supabase';

export default function LoginPage() {
	const handleGoogleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: 'http://localhost:3000/standup',
			},
		});
	};

	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold mb-8">StandupBot</h1>
			<button
				onClick={handleGoogleLogin}
				className="bg-black text-white px-6 py-3 rounded font-bold"
			>
				Sign in with Google
			</button>
		</main>
	);
}
