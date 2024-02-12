import OpenAI from 'openai';
import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct',
    max_tokens: 24,
    stream: true,
    prompt,
  });

  
  const data = new experimental_StreamData();

  data.append({ test: 'value' });

  const stream = OpenAIStream(response, {
    onFinal(completion) {
      data.close();
    },
    experimental_streamData: true,
  });

  return new StreamingTextResponse(stream, {}, data);
}