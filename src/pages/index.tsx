import { Box } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import { SITE_URL } from '../utils/config'
import ConversationInterface from '../components/ConversationInterface'
import { Head } from '../components/Head'

export default function Home() {
  const seoTitle = "Chat with Julien's Assistant - Francesca"
  const seoDescription = "Have a conversation with Francesca, Julien's assistant!"

  return (
    <>
      <NextSeo
        title={seoTitle}
        titleTemplate="%s"
        description={seoDescription}
        canonical={SITE_URL}
        openGraph={{
          type: 'website',
          url: SITE_URL,
          title: seoTitle,
          description: seoDescription,
          site_name: 'Francesca - AI Assistant',
          images: [
            {
              url: `${SITE_URL}/huangshan.png`,
              width: 1200,
              height: 630,
              alt: "Julien's AI Assistant",
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@w3hc8',
        }}
      />
      <Head title={seoTitle} description={seoDescription} />
      <Box as="main" minH="calc(100vh - 100px)">
        <ConversationInterface />
      </Box>
    </>
  )
}
