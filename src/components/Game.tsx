import { useState, useEffect } from 'react'
import { GameState, Player } from '../types/blackjack'
import { createDeck, dealInitialCards, hit, stand } from '../utils/gameLogic'
import Card from './Card'
import './Game.css'

const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    deck: createDeck(),
    players: [
      { name: 'Player', hand: [], score: 0, isDealer: false },
      { name: 'Dealer', hand: [], score: 0, isDealer: true }
    ],
    currentPlayerIndex: 0,
    gameStatus: 'waiting',
    showDealerCards: false
  })

  // Start the game automatically when the component mounts
  useEffect(() => {
    const newState = dealInitialCards({ ...gameState, deck: createDeck() })
    setGameState({ ...newState, gameStatus: 'playing', showDealerCards: false })
  }, [])

  const startGame = () => {
    const newState = dealInitialCards({ 
      ...gameState, 
      deck: createDeck(),
      currentPlayerIndex: 0,
      gameStatus: 'playing',
      showDealerCards: false,
      winner: undefined
    })
    setGameState(newState)
  }

  const handleHit = () => {
    const newState = hit(gameState)
    setGameState(newState)
  }

  const handleStand = () => {
    const newState = stand(gameState)
    setGameState({ ...newState, showDealerCards: true })
  }

  const renderPlayer = (player: Player) => (
    <div className={player.isDealer ? 'dealer-section' : 'player-section'}>
      <h2>{player.name}</h2>
      <div className="score">
        Score: {player.isDealer && !gameState.showDealerCards ? '?' : player.score}
        {!player.isDealer && player.score > 21 && <span className="bust">BUST!</span>}
      </div>
      <div className="hand">
        {player.hand.map((card, index) => (
          <div key={index}>
            <Card 
              card={card} 
              isFaceDown={player.isDealer && !gameState.showDealerCards}
            />
          </div>
        ))}
      </div>
      {!player.isDealer && (
        <div className="controls">
          <button 
            onClick={handleHit} 
            disabled={gameState.currentPlayerIndex !== 0 || gameState.showDealerCards || gameState.gameStatus === 'ended'}
          >
            Hit
          </button>
          <button 
            onClick={handleStand} 
            disabled={gameState.currentPlayerIndex !== 0 || gameState.showDealerCards || gameState.gameStatus === 'ended'}
          >
            Stand
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="game">
      {gameState.players.map((player, index) => (
        <div key={index}>{renderPlayer(player)}</div>
      ))}
      {gameState.gameStatus === 'ended' && (
        <div className="game-over">
          <h2>Game Over!</h2>
          {gameState.winner === 'player' && <p className="result-message win">You Win! 🎉</p>}
          {gameState.winner === 'dealer' && <p className="result-message lose">Dealer Wins! 😢</p>}
          {gameState.winner === 'push' && <p className="result-message push">Push! 🤝</p>}
          <button onClick={startGame}>Play Again</button>
        </div>
      )}
    </div>
  )
}

export default Game 