// //api.ts
// import { NextApiRequest, NextApiResponse } from 'next';
import openai from '@/app/utils/openai';


// --------- this works ---------
import { NextRequest, NextResponse } from 'next/server';



// I keep getting a 405 error so i'm trouble shooiting why. I removed the try/catch block, handler, and using the syntax for next.js 13
// chaanged the the axios request into fetch
export async function POST(req: NextRequest) {

//manage it in state on the client side move.send the whole messages array instead of product. feed the array with object then shove the array back into chatgpt.

  const { product } = await req.json();
  // const text = body.product;
  const prompt = 'Respond in 4-5 sentences about the topic, as if you were a batman. When signing off be sure to warn and remind the user to follow the law.'
  console.log('line 18 text', product)
  // const { messages } = req.body;
  const messages = [{ role: "system", content: `${prompt}` }, {
    role: "user", content: ` ${product}`
  }]
  console.log(messages)
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    // messages,
    messages: messages,

    temperature: 0.7,
  });
  // console.log('Completion - line 32', completion)
  const responseText = completion.data.choices[0].message.content;
  // console.log('chat completion on line 14 ', responseText)

  return NextResponse.json({ item: responseText });
}
