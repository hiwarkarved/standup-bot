import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
	const { yesterday, today, blockers } = await req.json();

	const completion = await groq.chat.completions.create({
		model: 'openai/gpt-oss-120b',
		messages: [
			{
				role: 'user',
				content: `Summarize this daily standup precisely in 2-3 sentences. Make sure to mention blockers if any are listed:
                Yesterday: ${yesterday}
                Today: ${today}
                Blockers: ${blockers}`,
			},
		],
	});

	const summary = completion.choices[0].message.content;
	return NextResponse.json({ summary });
}
