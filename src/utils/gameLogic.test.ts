import { describe, it, expect } from 'vitest'
import { createDeck, shuffleDeck, calculateScore, dealInitialCards, hit, stand, dealerTurn } from './gameLogic'
import { Card, GameState } from '../types/blackjack'

describe('gameLogic', () => {
  describe('createDeck', () => {
    it('should create a deck with 52 cards', () => {
      const deck = createDeck()
      expect(deck).toHaveLength(52)
    })

    it('should create a deck with all suits and ranks', () => {
      const deck = createDeck()
      const suits = new Set(deck.map(card => card.suit))
      const ranks = new Set(deck.map(card => card.rank))

      expect(suits).toEqual(new Set(['hearts', 'diamonds', 'clubs', 'spades']))
      expect(ranks).toEqual(new Set(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']))
    })
  })

  describe('shuffleDeck', () => {
    it('should maintain all cards in the deck', () => {
      const deck = createDeck()
      const shuffled = shuffleDeck([...deck])
      
      expect(shuffled).toHaveLength(deck.length)
      expect(new Set(shuffled)).toEqual(new Set(deck))
    })

    it('should not be in the same order as the original deck', () => {
      const deck = createDeck()
      const shuffled = shuffleDeck([...deck])
      
      // Note: There's a very small chance this test could fail if the shuffle
      // happens to produce the same order, but it's extremely unlikely
      expect(shuffled).not.toEqual(deck)
    })
  })

  describe('calculateScore', () => {
    it('should calculate correct score for number cards', () => {
      const hand: Card[] = [
        { suit: 'hearts', rank: '2' },
        { suit: 'diamonds', rank: '5' }
      ]
      expect(calculateScore(hand)).toBe(7)
    })

    it('should calculate correct score for face cards', () => {
      const hand: Card[] = [
        { suit: 'hearts', rank: 'K' },
        { suit: 'diamonds', rank: 'Q' }
      ]
      expect(calculateScore(hand)).toBe(20)
    })

    it('should handle aces as 11 when beneficial', () => {
      const hand: Card[] = [
        { suit: 'hearts', rank: 'A' },
        { suit: 'diamonds', rank: '9' }
      ]
      expect(calculateScore(hand)).toBe(20)
    })

    it('should handle aces as 1 when 11 would bust', () => {
      const hand: Card[] = [
        { suit: 'hearts', rank: 'A' },
        { suit: 'diamonds', rank: '9' },
        { suit: 'clubs', rank: 'A' }
      ]
      expect(calculateScore(hand)).toBe(21)
    })

    it('should handle multiple aces correctly', () => {
      const hand: Card[] = [
        { suit: 'hearts', rank: 'A' },
        { suit: 'diamonds', rank: 'A' },
        { suit: 'clubs', rank: 'A' }
      ]
      expect(calculateScore(hand)).toBe(13)
    })
  })

  describe('dealInitialCards', () => {
    it('should deal two cards to each player', () => {
      const deck = createDeck()
      const initialState: GameState = {
        deck: [...deck],
        players: [
          { name: 'Player', hand: [], score: 0, isDealer: false },
          { name: 'Dealer', hand: [], score: 0, isDealer: true }
        ],
        currentPlayerIndex: 0,
        gameStatus: 'waiting',
        showDealerCards: false
      }

      const newState = dealInitialCards(initialState)

      expect(newState.players[0].hand).toHaveLength(2)
      expect(newState.players[1].hand).toHaveLength(2)
      expect(newState.deck).toHaveLength(deck.length - 4)
    })

    it('should calculate initial scores correctly', () => {
      const deck = createDeck()
      const initialState: GameState = {
        deck: [...deck],
        players: [
          { name: 'Player', hand: [], score: 0, isDealer: false },
          { name: 'Dealer', hand: [], score: 0, isDealer: true }
        ],
        currentPlayerIndex: 0,
        gameStatus: 'waiting',
        showDealerCards: false
      }

      const newState = dealInitialCards(initialState)

      expect(newState.players[0].score).toBe(calculateScore(newState.players[0].hand))
      expect(newState.players[1].score).toBe(calculateScore(newState.players[1].hand))
    })
  })

  describe('hit', () => {
    it('should add a card to the current player', () => {
      const deck = createDeck()
      const initialState: GameState = {
        deck: [...deck],
        players: [
          { name: 'Player', hand: [], score: 0, isDealer: false },
          { name: 'Dealer', hand: [], score: 0, isDealer: true }
        ],
        currentPlayerIndex: 0,
        gameStatus: 'playing',
        showDealerCards: false
      }

      const newState = hit(initialState)

      expect(newState.players[0].hand).toHaveLength(1)
      expect(newState.deck).toHaveLength(deck.length - 1)
      expect(newState.players[0].score).toBe(calculateScore(newState.players[0].hand))
    })
  })

  describe('stand', () => {
    it('should move to the next player', () => {
      const deck = createDeck()
      const initialState: GameState = {
        deck: [...deck],
        players: [
          { name: 'Player', hand: [], score: 0, isDealer: false },
          { name: 'Dealer', hand: [], score: 0, isDealer: true }
        ],
        currentPlayerIndex: 0,
        gameStatus: 'playing',
        showDealerCards: false
      }

      const newState = stand(initialState)

      expect(newState.currentPlayerIndex).toBe(1)
    })

    it('should wrap around to the first player', () => {
      const deck = createDeck()
      const initialState: GameState = {
        deck: [...deck],
        players: [
          { name: 'Player', hand: [], score: 0, isDealer: false },
          { name: 'Dealer', hand: [], score: 0, isDealer: true }
        ],
        currentPlayerIndex: 1,
        gameStatus: 'playing',
        showDealerCards: false
      }

      const newState = stand(initialState)

      expect(newState.currentPlayerIndex).toBe(0)
    })
  })

  describe('dealerTurn', () => {
    it('should hit on soft 17', () => {
      const deck = createDeck()
      const initialState: GameState = {
        deck: [...deck],
        players: [
          { name: 'Player', hand: [], score: 0, isDealer: false },
          { 
            name: 'Dealer', 
            hand: [
              { suit: 'hearts', rank: 'A' },
              { suit: 'diamonds', rank: '6' }
            ], 
            score: 17, 
            isDealer: true 
          }
        ],
        currentPlayerIndex: 1,
        gameStatus: 'playing',
        showDealerCards: true
      }

      const newState = dealerTurn(initialState)
      expect(newState.players[1].hand.length).toBeGreaterThan(2)
    })

    it('should stand on hard 17', () => {
      const deck = createDeck()
      const initialState: GameState = {
        deck: [...deck],
        players: [
          { name: 'Player', hand: [], score: 0, isDealer: false },
          { 
            name: 'Dealer', 
            hand: [
              { suit: 'hearts', rank: 'K' },
              { suit: 'diamonds', rank: '7' }
            ], 
            score: 17, 
            isDealer: true 
          }
        ],
        currentPlayerIndex: 1,
        gameStatus: 'playing',
        showDealerCards: true
      }

      const newState = dealerTurn(initialState)
      expect(newState.players[1].hand.length).toBe(2)
      expect(newState.gameStatus).toBe('ended')
    })

    it('should end game if dealer busts', () => {
      const deck = createDeck()
      const initialState: GameState = {
        deck: [...deck],
        players: [
          { name: 'Player', hand: [], score: 0, isDealer: false },
          { 
            name: 'Dealer', 
            hand: [
              { suit: 'hearts', rank: 'K' },
              { suit: 'diamonds', rank: '6' }
            ], 
            score: 16, 
            isDealer: true 
          }
        ],
        currentPlayerIndex: 1,
        gameStatus: 'playing',
        showDealerCards: true
      }

      const newState = dealerTurn(initialState)
      expect(newState.gameStatus).toBe('ended')
    })
  })
}) 