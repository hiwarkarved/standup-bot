import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
	const { to, summary } = await req.json()

	const { error } = await resend.emails.send({
		from: 'onboarding@resend.dev',
		to,
		subject: 'Your Daily Standup Summary',
		html: `<h2>Standup Summary</h2><p>${summary}</p>`,
	})

	if (error) {
		return NextResponse.json({ error }, { status: 500 })
	}

	return NextResponse.json({ success: true })
}