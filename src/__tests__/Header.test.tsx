import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '../components/Header'

// Mock the Web3Modal component
jest.mock('../context/web3modal', () => ({
  Web3Modal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('Header', () => {
  it('displays the site name', () => {
    render(<Header />)
    expect(screen.getByText('Francesca')).toBeInTheDocument()
  })
})
