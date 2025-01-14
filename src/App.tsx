import { useState, useEffect } from 'react'
import './App.css'
import Gameboard from './Gameboard.tsx'
import {Field} from './types.ts'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [chosenSymbol, setChosenSymbol] = useState<string>("✖️")
  const [player2Symbol, setPlayer2Symbol] = useState("🅾️")
  const [gameFields, setGameFields] = useState<Field[]>(() => generateGameFields())
  const [playerTurns, setPlayerTurns] = useState<number>(0)
  const [lastTurnBelongedTo, setLastTurnBelongedTo] = useState<string>("")

  useEffect(() => {
    if(gameStarted) {
      randomlyFillField()
    }
  }, [playerTurns])

  const symbols = [
    "✖️",
    "🅾️",
    "🪿",
    "💟",
    "🥔",
    "🐮",
    "🦊",
    "🌳"
  ]

  const gameboardFull = gameFields.every(field => field.value !== "")

  const winConditions = [
    (gameFields[0].value === gameFields[1].value && gameFields[1].value === gameFields[2].value && gameFields[2].selected),
    (gameFields[3].value === gameFields[4].value && gameFields[4].value === gameFields[5].value && gameFields[5].selected),
    (gameFields[6].value === gameFields[7].value && gameFields[7].value === gameFields[8].value && gameFields[8].selected),
    (gameFields[0].value === gameFields[3].value && gameFields[3].value === gameFields[6].value && gameFields[6].selected),
    (gameFields[1].value === gameFields[4].value && gameFields[4].value === gameFields[7].value && gameFields[7].selected),
    (gameFields[2].value === gameFields[5].value && gameFields[5].value === gameFields[8].value && gameFields[8].selected),
    (gameFields[0].value === gameFields[4].value && gameFields[4].value === gameFields[8].value && gameFields[8].selected),
    (gameFields[2].value === gameFields[4].value && gameFields[4].value === gameFields[6].value && gameFields[6].selected)
  ]

  const gameWon = checkGameWon()

  const gameOver = gameWon || gameboardFull

  const options = symbols.map(symbol => <option value={symbol}>{symbol}</option>)


  
  function checkGameWon() {
    return winConditions.includes(true)
  }

  function handlePlay() {
    setGameStarted(true)
    if(chosenSymbol === player2Symbol) {
      setPlayer2Symbol(symbols.find(s => s != chosenSymbol) || "🔥")
    }
  }

  function handleChange(event: any){
    const {value} = event.target
    setChosenSymbol(value)
  }

  function generateGameFields() {
    return new Array(9).fill({}).map((_field, index) => ({position: index + 1, value: "", selected: false}))
  }

  function updateGameFields(field: Field, symbol: string){
    console.debug("Updating field...", field, symbol)
    if(!gameWon) {
      setGameFields(existingGameFields => {
        return existingGameFields.map(existingField => {
          if(existingField.position === field.position && !existingField.selected) {
            return {
              ...existingField,
              value: symbol,
              selected: true
            }
          } else {
            return existingField
          }
        })
      })

      setLastTurnBelongedTo(symbol)
    }
  }

  function getRandomPosition() {
    return Math.ceil(Math.random() * 9)
  }

  function restartGame() {
    setGameStarted(false)
    setGameFields(generateGameFields())
  }

  function randomlyFillField() {
    // While there are still open positions AND the position chosen is not filled, 
    // choose that position for the randomized player
    if(!gameboardFull && !gameWon) {
      let foundEmptyField = false
      while(!foundEmptyField) {
        const randomPosition = getRandomPosition()
        const foundField = gameFields.find(field => field.position === randomPosition && field.value === "")
        if(foundField) {
          foundEmptyField = true
          updateGameFields(foundField, player2Symbol)
        }
      }
    }

  }

  return (
    <div className="ttt-container">
      <h1 className="heading">Tic Tac Toe</h1>
      {!gameStarted && <p className="emojis">✖️ 🅾️ 🪿 💟 🥔 🐮 🦊 🌳</p>}
      {!gameStarted && <div className="decision">
        <h2>Please choose your symbol:</h2>
        <select name="chosenSymbol" value={chosenSymbol} onChange={handleChange} className="decision--dropdown">
          {options}
        </select>`
        <button className="gamestart" onClick={handlePlay}>PLAY</button>
      </div>}
      {gameStarted && <Gameboard chosenSymbol={chosenSymbol} gameFields={gameFields} updateGameFields={updateGameFields} setPlayerTurns={setPlayerTurns} />}
      {gameOver && 
      <div>
        <h3 className="won-text">{gameWon ? `${lastTurnBelongedTo} Won!` : "You Lost :("}</h3>
        <button className="restart" onClick={restartGame}>Play Again</button>
      </div>
      }
      {gameStarted && !gameWon && !gameOver &&
      <div>
        <h3 className="instructions">Click a square to make your move</h3>
        <button className="restart" onClick={restartGame}>Restart</button>
      </div>
      }
    </div>
  )
}

export default App
