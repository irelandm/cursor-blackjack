import { Card as CardType } from '../types/blackjack'
import './Card.css'

interface CardProps {
  card: CardType
  isFaceDown?: boolean
}

const Card = ({ card, isFaceDown = false }: CardProps) => {
  if (isFaceDown) {
    return (
      <div className="card face-down">
        <img src="/cards/back.png" alt="Card back" className="card-image" />
      </div>
    )
  }

  const suitMap: { [key: string]: string } = {
    'hearts': 'H',
    'diamonds': 'D',
    'clubs': 'C',
    'spades': 'S'
  }

  const cardImage = `/cards/${card.rank}${suitMap[card.suit]}.png`

  return (
    <div className="card">
      <img src={cardImage} alt={`${card.rank} of ${card.suit}`} className="card-image" />
    </div>
  )
}

export default Card 