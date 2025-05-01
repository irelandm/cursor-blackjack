export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  rank: Rank
}

export interface Player {
  name: string
  hand: Card[]
  score: number
  isDealer: boolean
}

export interface GameState {
  deck: Card[]
  players: Player[]
  currentPlayerIndex: number
  gameStatus: 'waiting' | 'playing' | 'ended'
  showDealerCards: boolean
  winner?: 'player' | 'dealer' | 'push'
} 