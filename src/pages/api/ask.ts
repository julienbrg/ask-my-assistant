import type { NextApiRequest, NextApiResponse } from 'next'

interface RukhResponse {
  output?: string
  answer?: string
  model?: string
  network?: string
  txHash?: string
  explorerLink?: string
  conversationId?: string
  sessionId?: string
  usage?: {
    input_tokens?: number
    output_tokens?: number
    cache_creation_input_tokens?: number
    cache_read_input_tokens?: number
  }
}

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

  try {
    const formData = new FormData()
    formData.append('message', message)
    formData.append('model', 'anthropic')
    formData.append('context', 'francesca')

    if (conversationId) {
      formData.append('conversationId', conversationId)
    }

    console.log('📡 Sending request to Rukh API...')
    const response = await fetch('https://rukh.w3hc.org/ask', {
      method: 'POST',
      body: formData,
    })

    console.log('🔍 Rukh API response status:', response.status)
    console.log('🔍 Rukh API response headers:', Object.fromEntries(response.headers))

    if (!response.ok) {
      let errorText = await response.text()
      console.error('❌ Rukh API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(`Rukh API error: ${response.status} ${response.statusText}\n${errorText}`)
    }

    const data: RukhResponse = await response.json()

    // Log the complete response for debugging
    console.log('📄 Full Rukh API response:', JSON.stringify(data, null, 2))

    // Determine the response content from various possible fields
    let responseContent = data.output || data.answer || ''

    // Check if we have a valid response
    if (!responseContent) {
      console.warn('⚠️ No content found in API response, using fallback message')
      responseContent =
        "I apologize, but I couldn't process your request properly. Please try again or contact support if the issue persists."
    }

    // Log meaningful information about the response
    console.log('✅ API response details:', {
      contentLength: responseContent.length,
      sessionId: data.sessionId || data.conversationId || 'not provided',
      model: data.model || 'unknown',
      usageInfo: data.usage ? 'available' : 'not available',
      timestamp: new Date().toISOString(),
    })

    // Return normalized response structure to the client
    return res.status(200).json({
      answer: responseContent,
      conversationId: data.conversationId || data.sessionId || conversationId || null,
      usage: data.usage || null,
      model: data.model || null,
      txHash: data.txHash || null,
      explorerLink: data.explorerLink || null,
    })
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
