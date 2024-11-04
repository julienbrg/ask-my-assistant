import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { message, conversationId } = req.body

  if (!message) {
    return res.status(400).json({ message: 'Message is required' })
  }

  const FATOU_API_URL = process.env.FATOU_API_URL || 'http://193.108.55.119:3000/ai/ask'

  try {
    const formData = new FormData()
    formData.append('message', message)

    if (!conversationId) {
      const contextPath = path.join(process.cwd(), 'src', 'utils', 'context.md')
      const contextContent = fs.readFileSync(contextPath, 'utf8')

      const contextFile = new File([contextContent], 'context.md', {
        type: 'text/markdown',
      })
      formData.append('file', contextFile)
    }

    if (conversationId) {
      formData.append('conversationId', conversationId)
    }

    const response = await fetch(FATOU_API_URL, {
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
    return res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
