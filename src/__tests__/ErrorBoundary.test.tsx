import React from 'react'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary'
import '@testing-library/jest-dom'

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error')
  }

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error message when there is an error', () => {
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/All apologies, the app is not yet available/)).toBeInTheDocument()

    spy.mockRestore()
  })
})

// jest.setup.ts
import '@testing-library/jest-dom'

// Mock Web3Modal and other external dependencies
jest.mock('@reown/appkit/react', () => ({
  useAppKitAccount: () => ({
    address: null,
    isConnected: false,
    caipAddress: null,
  }),
  useAppKitProvider: () => ({
    walletProvider: null,
  }),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
