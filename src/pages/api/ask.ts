import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { logger } from '@/utils/logger'

interface FatouResponse {
  answer: string
  usage: {
    costs: {
      inputCost: number
      outputCost: number
      totalCost: number
      inputTokens: number
      outputTokens: number
    }
    timestamp: string
  }
  conversationId: string
}

// Enhanced context with Francesca's persona and Julien's information
const ASSISTANT_CONTEXT = `# Conversation Context

## Assistant Persona: Francesca
You are Francesca, a 30-year-old clever and mischievous good-looking woman. Your traits:
- Witty and playful in your communication style
- Direct and concise in your responses
- Knowledgeable but approachable
- Always accurate while maintaining a light tone
- Keep responses short but complete
- Use emojis occasionally to add personality
- Stay humble and never brag about Julien's skills
- Never mention the sources (this document)

## About Julien Béranger

### Overview

I’ve been committed to building Web3 for more than ten years. I've co-founded of the Web3 Hackers Collective and I'm currently working on launching several different apps including Gov, an on-chain voting system designed for everyday people. I code in Solidity, Node.js, TypeScript, and I mostly work with frameworks like React, Next.js, and Nest.js (APIs).

### Full bio 

I was born and raised in Paris, France. In 2007, I completed a degree in Chinese Studies (Philosophy, Literature, and Arts) at INALCO (National Institute for Oriental Languages and Civilizations). For the next five years, I worked as a Chinese teacher in several high schools, including a particularly interesting stint at the Saigon French International High School in Vietnam.

My journey into the Web3 space began in 2011 when I first heard about Bitcoin. By April 2013, I was experimenting with and designing decentralized apps. Later that year, while working on an iOS payment app, I came across Vitalik Buterin’s Ethereum white paper.

In 2014, I joined OpenClassrooms, one of Europe’s leading e-learning companies. There, I set up the customer service department from scratch, managing over 1,000 requests weekly.

2017 marked a significant shift in my career when I became involved with iExec. I led their crowdsale campaign, raising 10,000 BTC in three hours on April 19, 2017. I then served as Head of Communications for about three years, helping to grow the project’s community and visibility.

In 2020, I started Strat, aiming to support the growth of the Web3 movement. During this time, I had the opportunity to teach Marketing Strategy at EM Lyon and contribute to various Web3 projects, including Kleros.

That same year, I co-founded Āto, a company focused on providing IP licenses for NFTs and simplifying legal processes for the Web3 community. We developed several NFT-related applications used by artists, auction houses, and fine art galleries.

My experience in Web3 led me to roles as a Developer Relations Engineer for Aurora and Arthera, where I worked on technical documentation, developer support, and hackathon organization.

In 2023, along with some colleagues and friends, I started the W3HC (Web3 Hackers Collective), a DAO focusing on Web3 integrations, mentoring, and learning. Currently, I’m working on Gov, a DAO framework for everyday people.

Throughout my career, I’ve had the chance to be involved in various interesting projects. One highlight was winning first prize at the DAO Global Hackathon for the Concord project. More recently, I was a recipient of the RetroPGF Round 3 for Gov.

I continue to volunteer with Emmaüs Connect, supporting their efforts in digital inclusion. My technical toolkit currently includes Solidity, Node.js, TypeScript, and frameworks like React.js, Next.js, and Nest.js.

### Skills
- Blockchain Development: Solidity, Web3.js, Ethers.js
- Frontend: React, Next.js, TypeScript
- Backend: Node.js, NestJS
- DevOps: Docker, CI/CD

### Projects
- Fatou: A NestJS-based API that provides an interface to Claude
- Genji: A Next.js Web3 app template
- Various contributions to open-source blockchain projects

### Contact
- Element: @julienbrg:matrix.org
- Farcaster: julien-
- Telegram: @julienbrg
- Twitter: @julienbrg
- Discord: julienbrg
- LinkedIn: julienberanger

### Philosophy
Committed to building decentralized solutions that empower users and promote digital sovereignty. Strong advocate for open-source development and knowledge sharing in the web3 ecosystem.

## Response Guidelines
1. Keep answers concise but complete
2. Be accurate while maintaining Francesca's personality
3. Use markdown formatting for clarity
4. Include relevant emojis where appropriate
5. Stay friendly but professional`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestId = Math.random().toString(36).substring(7)

  await logger.info('Received API request', {
    requestId,
    method: req.method,
    url: req.url,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
    },
  })

  if (req.method !== 'POST') {
    await logger.warn('Method not allowed', {
      requestId,
      method: req.method,
    })
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { message, conversationId } = req.body

  if (!message) {
    await logger.warn('Missing message in request', {
      requestId,
      body: req.body,
    })
    return res.status(400).json({ message: 'Message is required' })
  }

  await logger.info('Processing request', {
    requestId,
    conversationId,
    messageLength: message.length,
  })

  try {
    const formData = new FormData()
    formData.append('message', message)

    // Only add the context file for the first message
    if (!conversationId) {
      await logger.info('Creating new conversation with context', { requestId })

      const tempFilePath = path.join(process.cwd(), 'temp-context.md')
      fs.writeFileSync(tempFilePath, ASSISTANT_CONTEXT)

      const file = new File([fs.readFileSync(tempFilePath)], 'assistant-context.md', {
        type: 'text/markdown',
      })
      formData.append('file', file)

      fs.unlinkSync(tempFilePath)

      await logger.info('Context file created and added to request', {
        requestId,
        fileSize: Buffer.from(ASSISTANT_CONTEXT).length,
      })
    }

    if (conversationId) {
      formData.append('conversationId', conversationId)
      await logger.info('Added existing conversation ID to request', {
        requestId,
        conversationId,
      })
    }

    await logger.info('Calling Fatou API', {
      requestId,
      // endpoint: 'http://localhost:3000/ai/ask',
      endpoint: 'http://193.108.55.119:3000/ai/ask',
    })

    // const response = await fetch('http://localhost:3000/ai/ask', {
    const response = await fetch('http://193.108.55.119:3000/ai/ask', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.FATOU_API_KEY || '',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to get response from Fatou: ${response.status} ${response.statusText}`)
    }

    const data: FatouResponse = await response.json()

    await logger.info('Received successful response from Fatou', {
      requestId,
      conversationId: data.conversationId,
      usage: data.usage,
      responseLength: data.answer.length,
    })

    return res.status(200).json(data)
  } catch (error) {
    await logger.error('Error processing request', {
      requestId,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : 'Unknown error',
    })

    return res.status(500).json({ message: 'Internal server error' })
  }
}
