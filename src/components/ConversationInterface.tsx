import { useState, useEffect, useRef } from 'react'
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Container,
  Flex,
  Avatar,
  Spinner,
  Divider,
  Code,
  Link,
} from '@chakra-ui/react'
import { IoSend } from 'react-icons/io5'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface Message {
  role: 'user' | 'assistant' | 'error'
  content: string
  timestamp: string
  error?: any
}

const ASSISTANT_INFO = {
  name: 'Francesca',
  avatarUrl: '/francesca-image.webp',
  role: "Julien's AI Assistant",
}

// Custom markdown components using Chakra UI
const MarkdownComponents = {
  p: (props: any) => (
    <Text mb={2} lineHeight="tall">
      {props.children}
    </Text>
  ),

  h1: (props: any) => (
    <Text as="h1" fontSize="2xl" fontWeight="bold" my={4}>
      {props.children}
    </Text>
  ),
  h2: (props: any) => (
    <Text as="h2" fontSize="xl" fontWeight="bold" my={3}>
      {props.children}
    </Text>
  ),
  h3: (props: any) => (
    <Text as="h3" fontSize="lg" fontWeight="bold" my={2}>
      {props.children}
    </Text>
  ),
  ul: (props: any) => (
    <Box as="ul" pl={4} my={2}>
      {props.children}
    </Box>
  ),
  ol: (props: any) => (
    <Box as="ol" pl={4} my={2}>
      {props.children}
    </Box>
  ),
  li: (props: any) => (
    <Box as="li" mb={1}>
      {props.children}
    </Box>
  ),
  blockquote: (props: any) => (
    <Box borderLeftWidth="4px" borderLeftColor="gray.200" pl={4} py={2} my={4}>
      {props.children}
    </Box>
  ),
  code: ({ inline, className, children }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : ''

    if (inline) {
      return (
        <Text as="code" px={1} bg="gray.100" borderRadius="sm">
          {children}
        </Text>
      )
    }

    return (
      <Box my={4}>
        <SyntaxHighlighter language={language} style={tomorrow} customStyle={{ borderRadius: '8px' }}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </Box>
    )
  },
  pre: (props: any) => <Box {...props} />,
  strong: (props: any) => (
    <Text as="strong" fontWeight="bold">
      {props.children}
    </Text>
  ),
  em: (props: any) => (
    <Text as="em" fontStyle="italic">
      {props.children}
    </Text>
  ),
  a: (props: any) => (
    <Link
      color="white"
      href={props.href}
      isExternal
      textDecoration="underline"
      _hover={{
        color: 'blue.200',
        textDecoration: 'none',
      }}
      onClick={(e) => {
        if (!props.href || props.href === '#') {
          e.preventDefault()
          return
        }
      }}>
      {props.children}
    </Link>
  ),
}

export default function ConversationInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  // Smooth scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Scroll when new messages are added
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm Francesca, Julien's assistant. How can I help you, my friend?",
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setIsLoading(true)

    console.log('💬 Sending message:', {
      message: userMessage,
      conversationId,
      timestamp: new Date().toISOString(),
    })

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ])

    try {
      console.log('🚀 Sending request to /api/ask:', {
        message: userMessage,
        conversationId,
        timestamp: new Date().toISOString(),
      })

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
        }),
      })

      const responseData = await response.json()

      console.log('📥 Response received:', {
        status: response.status,
        conversationId: responseData.conversationId,
        answerLength: responseData.answer?.length,
        timestamp: new Date().toISOString(),
      })

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to get response')
      }

      if (!conversationId && responseData.conversationId) {
        setConversationId(responseData.conversationId)
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: responseData.answer,
          timestamp: new Date().toISOString(),
        },
      ])
    } catch (error) {
      console.error('❌ Error in conversation:', {
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

      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          content: error instanceof Error ? error.message : 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
          error: error,
        },
      ])

      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response from assistant',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // In ConversationInterface.tsx, add this function inside the component:

  const renderMessage = (message: Message) => {
    if (message.role === 'error') {
      return (
        <Box bg="red.100" p={4} borderRadius="lg" width="100%">
          <Text color="red.800" fontWeight="bold">
            Error:
          </Text>
          <Text color="red.800">{message.content}</Text>
          {message.error && (
            <Code colorScheme="red" mt={2} p={2} display="block">
              {JSON.stringify(message.error, null, 2)}
            </Code>
          )}
        </Box>
      )
    }

    return (
      <Box
        maxW="80%"
        bg={message.role === 'user' ? '#45a2f8' : '#8c1c84'}
        color="white"
        px={4}
        py={2}
        borderRadius="lg"
        boxShadow="sm"
        sx={{
          '& a': {
            color: 'white',
            textDecoration: 'underline',
            transition: 'color 0.2s ease-in-out',
            _hover: {
              color: 'blue.200',
              textDecoration: 'none',
            },
          },
        }}>
        {message.role === 'user' ? (
          <Text>{message.content}</Text>
        ) : (
          <ReactMarkdown components={MarkdownComponents} remarkPlugins={[]}>
            {message.content}
          </ReactMarkdown>
        )}
      </Box>
    )
  }

  return (
    <Container maxW="container.md" h="calc(100vh - 200px)" display="flex" flexDirection="column">
      <VStack
        ref={chatContainerRef}
        flex="1"
        spacing={4}
        overflowY="auto"
        py={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.300',
            borderRadius: '24px',
          },
        }}>
        {messages.map((message, index) => (
          <Flex key={index} w="100%" justify={message.role === 'user' ? 'flex-end' : 'flex-start'} align="start">
            {message.role === 'assistant' && (
              <Avatar size="sm" name={ASSISTANT_INFO.name} src={ASSISTANT_INFO.avatarUrl} mr={2} />
            )}
            {renderMessage(message)}
            {message.role === 'user' && (
              <Avatar
                size="sm"
                ml={2}
                src="https://bafkreicctn5ua3ctzctk62d4vpbsvipzlakdja4hzgh2nkwwauayrf76iy.ipfs.w3s.link/"
              />
            )}
          </Flex>
        ))}
        {isLoading && (
          <Flex w="100%" justify="flex-start" align="center">
            <Avatar size="sm" name={ASSISTANT_INFO.name} src={ASSISTANT_INFO.avatarUrl} mr={2} />
            <Spinner size="sm" color="blue.500" />
          </Flex>
        )}
        {/* Invisible div for scrolling reference */}
        <div ref={messagesEndRef} />
      </VStack>
      <Divider my={4} />
      <form onSubmit={handleSubmit}>
        <Flex gap={2}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button colorScheme="blue" type="submit" isLoading={isLoading} leftIcon={<IoSend />}>
            Send
          </Button>
        </Flex>
      </form>
    </Container>
  )
}
