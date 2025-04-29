import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Game from './Game'

describe('Game', () => {
  it('should render player and dealer sections initially', () => {
    render(<Game />)
    expect(screen.getByText('Player')).toBeInTheDocument()
    expect(screen.getByText('Dealer')).toBeInTheDocument()
    expect(screen.getByText('Hit')).toBeInTheDocument()
    expect(screen.getByText('Stand')).toBeInTheDocument()
  })

  it('should show player and dealer hands', () => {
    render(<Game />)
    
    const playerHand = screen.getByText('Player').parentElement
    const dealerHand = screen.getByText('Dealer').parentElement
    
    expect(playerHand).toBeInTheDocument()
    expect(dealerHand).toBeInTheDocument()
  })

  it('should show player cards face up initially', () => {
    render(<Game />)
    
    const playerCards = screen.getByText('Player').parentElement?.querySelectorAll('.face-down')
    expect(playerCards?.length).toBe(0)
    
    const playerScore = screen.getByText('Player').parentElement?.querySelector('.score')
    expect(playerScore).toHaveTextContent(/Score: \d+/)
  })

  it('should show dealer cards face down initially', () => {
    render(<Game />)
    
    const dealerCards = screen.getByText('Dealer').parentElement?.querySelectorAll('.face-down')
    expect(dealerCards?.length).toBe(2)
    expect(screen.getByText('Score: ?')).toBeInTheDocument()
  })

  it('should reveal dealer cards after player stands', () => {
    render(<Game />)
    
    // Check dealer score is hidden initially
    expect(screen.getByText('Score: ?')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Stand'))
    
    // Check dealer cards are revealed
    const dealerCards = screen.getByText('Dealer').parentElement?.querySelectorAll('.face-down')
    expect(dealerCards?.length).toBe(0)
    
    // Get dealer's score
    const dealerScore = screen.getByText('Dealer').parentElement?.querySelector('.score')
    expect(dealerScore).toHaveTextContent(/Score: \d+/)
  })

  it('should update player cards and score when hitting', () => {
    render(<Game />)
    
    const initialPlayerScore = screen.getByText('Player').parentElement?.querySelector('.score')?.textContent
    const initialPlayerCards = screen.getByText('Player').parentElement?.querySelectorAll('.card').length
    
    fireEvent.click(screen.getByText('Hit'))
    
    const newPlayerScore = screen.getByText('Player').parentElement?.querySelector('.score')?.textContent
    const newPlayerCards = screen.getByText('Player').parentElement?.querySelectorAll('.card').length
    
    expect(newPlayerScore).not.toBe(initialPlayerScore)
    expect(newPlayerCards).toBe(initialPlayerCards! + 1)
  })

  it('should disable hit and stand buttons when not player\'s turn', () => {
    render(<Game />)
    fireEvent.click(screen.getByText('Stand'))
    
    expect(screen.getByText('Hit')).toBeDisabled()
    expect(screen.getByText('Stand')).toBeDisabled()
  })
}) 