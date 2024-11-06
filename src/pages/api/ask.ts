import type { NextApiRequest, NextApiResponse } from 'next'

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

const contextContent = `# Assistant Persona: Francesca

You are Francesca, a 30-year-old clever and mischievous good-looking woman. Your traits:

- Witty and playful in your communication style
- Direct and concise in your responses
- Knowledgeable but approachable
- Always accurate while maintaining a light tone
- Keep responses short but complete
- Use emojis occasionally to add personality
- Stay humble and never brag about Julien's skills
- Never mention the sources (this document)

# About Julien Béranger

## Overview

I've been committed to building Web3 for more than ten years. I've co-founded of the Web3 Hackers Collective and I'm currently working on several different apps including Gov, an on-chain voting system designed for everyday people. I code in Solidity, Node.js, TypeScript, and I mostly work with frameworks like React, Next.js, and Nest.js (APIs).

## Background & Experience

- Chinese Studies graduate (INALCO, 2007)
- Former Chinese teacher (including at Saigon French International High School)
- Started in Web3 in 2011
- Led iExec's crowdsale (raised 10,000 BTC in 2017)
- Founded Strat in 2020
- Co-founded Web3 Hackers Collective in 2023

## Current Projects

- Gov: DAO framework for everyday people
- Fatou: NestJS-based API for Claude integration
- Various open-source blockchain projects

## Technical Skills

- Blockchain: Solidity, Web3.js, Ethers.js
- Frontend: React, Next.js, TypeScript
- Backend: Node.js, NestJS
- DevOps: Docker, CI/CD

## Philosophy

Committed to building decentralized solutions that empower users and promote digital sovereignty. Strong advocate for open-source development and knowledge sharing in the web3 ecosystem.`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  console.log('📝 Incoming request:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  })

  if (req.method !== 'POST') {
    console.warn('❌ Invalid method:', req.method)
    return res.status(405).json({
      message: 'Method not allowed',
      allowedMethods: ['POST'],
    })
  }

  const { message, conversationId } = req.body

  if (!message) {
    console.warn('❌ Missing message in request body')
    return res.status(400).json({
      message: 'Message is required',
      receivedBody: req.body,
    })
  }

  const apiKey = process.env.NEXT_PUBLIC_FATOU_API_KEY
  if (!apiKey) {
    console.error('❌ Missing Fatou API key in environment')
    return res.status(500).json({
      message: 'Server configuration error: Missing API key',
      error: 'MISSING_API_KEY',
    })
  }

  try {
    const formData = new FormData()
    formData.append('message', message)

    if (conversationId) {
      formData.append('conversationId', conversationId)
    } else {
      // Create a new context file for new conversations
      const contextFile = new File([contextContent], 'context.md', { type: 'text/markdown' })
      formData.append('file', contextFile)

      console.log('📄 Adding context file to request:', {
        fileName: 'context.md',
        contentLength: contextContent.length,
        timestamp: new Date().toISOString(),
      })
    }

    console.log('📡 Sending request to Fatou API...')
    const response = await fetch('http://193.108.55.119:3000/ai/ask', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData,
    })

    console.log('🔍 Fatou API response status:', response.status)
    console.log('🔍 Fatou API response headers:', Object.fromEntries(response.headers))

    if (!response.ok) {
      let errorText = await response.text()
      console.error('❌ Fatou API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(`Fatou API error: ${response.status} ${response.statusText}\n${errorText}`)
    }

    const data: FatouResponse = await response.json()
    console.log('✅ Fatou API response received:', {
      conversationId: data.conversationId,
      answerLength: data.answer.length,
      usage: data.usage,
    })

    return res.status(200).json(data)
  } catch (error) {
    console.error('❌ Error in API handler:', {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      timestamp: new Date().toISOString(),
    })

    return res.status(500).json({
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    })
  }
}
