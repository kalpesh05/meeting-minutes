const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeText(transcript) {
  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a meeting assistant that summarizes conversations.' },
      { role: 'user', content: `Please summarize the following meeting:\n\n${transcript}` }
    ],
    temperature: 0.5,
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = { summarizeText };

