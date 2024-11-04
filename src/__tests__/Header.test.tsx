import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '../components/Header'
import '@testing-library/jest-dom'

describe('Header', () => {
  it('renders the header component', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('displays the site name', () => {
    render(<Header />)
    expect(screen.getByRole('heading')).toHaveTextContent('Francesca')
  })

  it('includes navigation menu', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: /options/i })).toBeInTheDocument()
  })

  it('includes theme switcher', () => {
    render(<Header />)
    expect(screen.getByRole('button', { name: /options/i })).toBeInTheDocument()
  })
})
