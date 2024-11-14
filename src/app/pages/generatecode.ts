import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_KEYS = {
  chatGPT: process.env.CHATGPT_API_KEY, 
  gemini: process.env.GEMINI_API_KEY, 
  claude: process.env.CLAUDE_API_KEY, 
  llama: process.env.LLAMA_API_KEY, 
};

const generateCode = async (imageBase64: string, framework: string, model: string) => {
  let response;

  switch (model) {
    case 'ChatGPT':
      response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Generate code for this image: ${imageBase64} using ${framework}.` }],
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEYS.chatGPT}`,
          },
        }
      );
      break;

    case 'Gemini':
      // Make an API call to Gemini (use the appropriate URL and structure)
      response = await axios.post('https://api.gemini.com/v1/generate', {
        image: imageBase64,
        framework,
      }, {
        headers: {
          Authorization: `Bearer ${API_KEYS.gemini}`,
        },
      });
      break;

    case 'Claude':
      // Make an API call to Claude (use the appropriate URL and structure)
      response = await axios.post('https://api.claude.com/v1/generate', {
        input: imageBase64,
        framework,
      }, {
        headers: {
          Authorization: `Bearer ${API_KEYS.claude}`,
        },
      });
      break;

    case 'Llama':
      // Make an API call to Llama (use the appropriate URL and structure)
      response = await axios.post('https://api.llama.com/v1/generate', {
        input: imageBase64,
        framework,
      }, {
        headers: {
          Authorization: `Bearer ${API_KEYS.llama}`,
        },
      });
      break;

    default:
      throw new Error('Invalid model selected.');
  }

  return response.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { imageBase64, framework, model } = req.body;

    try {
      const generatedCode = await generateCode(imageBase64, framework, model);
      res.status(200).json({ code: generatedCode });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate code.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
