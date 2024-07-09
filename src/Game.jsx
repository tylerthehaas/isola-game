import React, { useState, useEffect, useRef } from 'react'
import Board from './Board'

const actionMap = {
  player1: {
    movePiece: {
      next: { player: 'player1', action: 'blockSquare' },
    },
    blockSquare: { next: { player: 'player2', action: 'movePiece' } },
  },
  player2: {
    movePiece: {
      next: { player: 'player2', action: 'blockSquare' },
    },
    blockSquare: {
      next: { player: 'player1', action: 'movePiece' },
    },
  },
}

const findIfSelectionNextToPlayer = (currentSelection, playerMarker, board) => {
  const { row: currentRow, col: currentCol } = currentSelection
  const { row: playerRow, col: playerCol } = playerMarker

  let isAbove,
    isAboveRight,
    isAboveLeft,
    isLeft,
    isBelowLeft,
    isBelow,
    isBelowRight,
    isRight = false

  if (board[currentRow - 1]) {
    isAbove = board[currentRow - 1][currentCol] === board[playerRow][playerCol]
    if (board[currentRow - 1][currentCol + 1]) {
      isAboveRight = board[currentRow - 1][currentCol + 1] === board[playerRow][playerCol]
    }
    if (board[currentRow - 1][currentCol - 1]) {
      isAboveLeft = board[currentRow - 1][currentCol - 1] === board[playerRow][playerCol]
    }
  }

  if (board[currentRow + 1]) {
    isBelow = board[currentRow + 1][currentCol] === board[playerRow][playerCol]
    if (board[currentRow + 1][currentCol - 1]) {
      isBelowLeft = board[currentRow + 1][currentCol - 1] === board[playerRow][playerCol]
    }
    if (board[currentRow + 1][currentCol + 1]) {
      isBelowRight = board[currentRow + 1][currentCol + 1] === board[playerRow][playerCol]
    }
  }

  if (board[currentRow][currentCol - 1]) {
    isLeft = board[currentRow][currentCol - 1] === board[playerRow][playerCol]
  }

  if (board[currentRow][currentCol + 1]) {
    isRight = board[currentRow][currentCol + 1] === board[playerRow][playerCol]
  }

  return isAbove || isAboveRight || isAboveLeft || isLeft || isBelowLeft || isBelow || isBelowRight || isRight
}

const Game = () => {
  const [board, setBoard] = useState(initializeBoard())
  const currentSelectionRef = useRef({ row: 3, col: 2 })
  const [playerOneMarker, setPlayerOneMarker] = useState({ row: 0, col: 1 })
  const [playerTwoMarker, setPlayerTwoMarker] = useState({ row: board.length - 1, col: 2 })
  const playerTurnRef = useRef({ player: 'player1', action: 'movePiece' })

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log(event.key)
      switch (event.key) {
        case 'ArrowUp':
          moveCursor('up')
          break
        case 'ArrowDown':
          moveCursor('down')
          break
        case 'ArrowLeft':
          moveCursor('left')
          break
        case 'ArrowRight':
          moveCursor('right')
          break
        case 'x':
          const { player } = playerTurnRef.current
          selectCell(playerTurnRef.current, player)
          break
        default:
        //   console.log(`unsupported key pressed ${event.key}`)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const selectCell = (currentSelection, playerTurnState) => {
    const { row, col } = currentSelection
    const { player, action } = playerTurnState
    setBoard((board) => {
      const newBoard = [...board]
      const selectedSquare = newBoard[row][col]
      const isNextToPlayer = findIfSelectionNextToPlayer(
        currentSelection,
        player === 'player1' ? playerOneMarker : playerTwoMarker,
        board,
      )
      const isAvailable = selectedSquare.isAvailable
      if (isNextToPlayer && isAvailable) {
        // set cell to players token or blocked square depending on what action they are on determined by action map
      }
    })
  }

  const moveCursor = (direction) => {
    const { row, col } = currentSelectionRef.current
    switch (direction) {
      case 'up':
        setBoard((board) => {
          const newBoard = [...board]
          if (newBoard[row - 1]) {
            newBoard[row][col] = { selected: false }
            newBoard[row - 1][col] = { selected: true }
            currentSelectionRef.current = { row: row - 1, col }
            return newBoard
          }
          return board
        })
        break

      case 'down':
        setBoard((board) => {
          const newBoard = [...board]
          if (newBoard[row + 1]) {
            newBoard[row][col] = { selected: false }
            newBoard[row + 1][col] = { selected: true }
            currentSelectionRef.current = { row: row + 1, col }
            return newBoard
          }
          return board
        })
        break

      case 'left':
        setBoard((board) => {
          const newBoard = [...board]
          if (newBoard[row][col - 1]) {
            newBoard[row][col] = { selected: false }
            newBoard[row][col - 1] = { selected: true }
            currentSelectionRef.current = { row, col: col - 1 }
            return newBoard
          }
          return board
        })
        break
      case 'right':
        setBoard((board) => {
          const newBoard = [...board]
          if (newBoard[row][col + 1]) {
            newBoard[row][col] = { selected: false }
            newBoard[row][col + 1] = { selected: true }
            currentSelectionRef.current = { row, col: col + 1 }
            return newBoard
          }
          return board
        })
        break
      default:
        break
    }
  }

  console.log({ board })

  return (
    <div>
      <h1>Isola Game</h1>
      <Board board={board} />
    </div>
  )
}

const initializeBoard = () => {
  const width = 4
  const height = 6
  const board = Array(height)
    .fill(null)
    .map(() => Array(width).fill({}))
  board[board.length - 1][2] = { value: 'A' }
  board[0][1] = { value: 'P' }
  board[3][2] = { selected: true }
  return board
}

export default Game
