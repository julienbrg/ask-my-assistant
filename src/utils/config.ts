import { ThemingProps } from '@chakra-ui/react'
export const SITE_DESCRIPTION = 'Francesca is Julien’s assistant. It interacts with Fatou API.'
export const SITE_NAME = 'Francesca'
export const SITE_URL = 'https://ask-my-assistant.netlify.app'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'blue'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'julienbrg'
export const SOCIAL_GITHUB = 'julienbrg/ask-my-assistant'

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
