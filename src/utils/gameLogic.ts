// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, GameState, Player, Rank, Suit } from '../types/blackjack'

export const createDeck = (): Card[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const deck: Card[] = []

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank })
    }
  }

  return shuffleDeck(deck)
}

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const calculateScore = (hand: Card[]): number => {
  let score = 0
  let aces = 0

  for (const card of hand) {
    if (card.rank === 'A') {
      aces += 1
      score += 11
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      score += 10
    } else {
      score += parseInt(card.rank)
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10
    aces -= 1
  }

  return score
}

export const dealInitialCards = (gameState: GameState): GameState => {
  const newState = { ...gameState }
  newState.players.forEach(player => {
    player.hand = []
    player.score = 0
  })

  // Deal two cards to each player
  for (let i = 0; i < 2; i++) {
    for (const player of newState.players) {
      const card = newState.deck.pop()
      if (card) {
        player.hand.push(card)
        player.score = calculateScore(player.hand)
      }
    }
  }

  return newState
}

export const isSoft17 = (hand: Card[]): boolean => {
  const score = calculateScore(hand)
  const hasAce = hand.some(card => card.rank === 'A')
  return score === 17 && hasAce
}

export type GameResult = 'player' | 'dealer' | 'push'

export const determineWinner = (playerScore: number, dealerScore: number): GameResult => {
  if (playerScore > 21) return 'dealer'
  if (dealerScore > 21) return 'player'
  if (playerScore > dealerScore) return 'player'
  if (dealerScore > playerScore) return 'dealer'
  return 'push'
}

export const dealerTurn = (gameState: GameState): GameState => {
  const newState = { ...gameState }
  const dealer = newState.players[1] // Dealer is always at index 1
  const player = newState.players[0] // Player is always at index 0
  
  // Dealer must hit on soft 17 or less
  while (dealer.score < 17 || isSoft17(dealer.hand)) {
    const card = newState.deck.pop()
    if (!card) break
    
    dealer.hand.push(card)
    dealer.score = calculateScore(dealer.hand)
    
    // If dealer busts, game ends
    if (dealer.score > 21) {
      newState.gameStatus = 'ended'
      newState.winner = 'player'
      return newState
    }
  }
  
  // Dealer stands, determine winner
  newState.gameStatus = 'ended'
  newState.winner = determineWinner(player.score, dealer.score)
  return newState
}

export const hit = (gameState: GameState): GameState => {
  const newState = { ...gameState }
  const currentPlayer = newState.players[newState.currentPlayerIndex]
  
  const card = newState.deck.pop()
  if (card) {
    currentPlayer.hand.push(card)
    currentPlayer.score = calculateScore(currentPlayer.hand)
    
    // Check if player busted
    if (currentPlayer.score > 21) {
      newState.gameStatus = 'ended'
      newState.showDealerCards = true
      return dealerTurn(newState)
    }
  }

  return newState
}

export const stand = (gameState: GameState): GameState => {
  const newState = { ...gameState }
  newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length
  newState.showDealerCards = true
  return dealerTurn(newState)
} 