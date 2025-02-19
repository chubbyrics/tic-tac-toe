import React, { useState, useEffect, useCallback } from "react";
import "./TicTacToe.css"; // Importing CSS file for styling

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [playAgainstAI, setPlayAgainstAI] = useState(false);
  const [gameMessage, setGameMessage] = useState("Player X's turn");

  const checkWinner = (board) => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : "Draw";
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
    setGameMessage("Player X's turn");
  };

  const aiMove = useCallback(() => {
    if (!playAgainstAI || xIsNext || winner) return;

    setTimeout(() => {
      const emptyCells = board.reduce((acc, cell, index) => {
        if (!cell) acc.push(index);
        return acc;
      }, []);

      if (emptyCells.length === 0) return;

      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newBoard = [...board];
      newBoard[randomIndex] = "O";
      setBoard(newBoard);

      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        setScores((prevScores) => ({ ...prevScores, [gameWinner]: prevScores[gameWinner] + 1 }));
        setGameMessage(gameWinner === "Draw" ? "It's a Draw!" : `Winner: ${gameWinner}`);
        setTimeout(resetBoard, 1000); // Auto-clear board after win
      } else {
        setGameMessage("Player X's turn");
      }
      setXIsNext(true);
    }, 500); // Adding delay to AI moves
  }, [board, playAgainstAI, winner, xIsNext]);

  useEffect(() => {
    aiMove();
  }, [aiMove]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScores((prevScores) => ({ ...prevScores, [gameWinner]: prevScores[gameWinner] + 1 }));
      setGameMessage(gameWinner === "Draw" ? "It's a Draw!" : `Winner: ${gameWinner}`);
      setTimeout(resetBoard, 1000); // Auto-clear board after win
    } else {
      setGameMessage(`Player ${xIsNext ? "O" : "X"}'s turn`);
    }
    setXIsNext(!xIsNext);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
  };

  const toggleGameMode = () => {
    resetBoard(); // Reset board when switching modes
    setPlayAgainstAI((prev) => !prev);
  };

  return (
    <div className="game-container">
      <h1>Tic-Tac-Toe</h1>
      <p className="status">{gameMessage}</p>
      <div className="score-ai-container">
        <p className="score">X: {scores.X}</p>
        <button className="toggle-ai" onClick={toggleGameMode}>
          {playAgainstAI ? "Play Against Human" : "Play Against AI"}
        </button>
        <p className="score">O: {scores.O}</p>
      </div>
      <div className="board">
        {board.map((cell, index) => (
          <button 
            key={index} 
            className={`cell ${cell === "X" ? "x" : cell === "O" ? "o" : ""}`} 
            onClick={() => handleClick(index)}>
            {cell}
          </button>
        ))}
      </div>
      <div className="button-container">
        <button className="reset-score-btn" onClick={resetScores}>Reset Scores</button>
      </div>
    </div>
  );
};

export default TicTacToe;
