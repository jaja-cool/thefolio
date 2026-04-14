import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import img1 from '../pages/pic/1.jpg';
import img2 from '../pages/pic/2.jpg';
import img3 from '../pages/pic/3.jpg';
import img4 from '../pages/pic/4.jpg';
import img5 from '../pages/pic/5.jpg';
import img6 from '../pages/pic/6.jpg';
import img7 from '../pages/pic/7.jpg';
import img8 from '../pages/pic/8.jpg';

const GamePage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [won, setWon] = useState(false);

  const shuffleCards = useCallback(() => {
    const images = [
      img1, img1,
      img2, img2,
      img3, img3,
      img4, img4,
      img5, img5,
      img6, img6,
      img7, img7,
      img8, img8
    ];
    const shuffledImages = [...images].sort(() => Math.random() - 0.5);
    setCards(shuffledImages);
    setFlippedCards([]);
    setMatchedCards([]);
    setLockBoard(false);
    setWon(false);
  }, []);

  // Initialize game on mount
  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);


  const handleCardClick = (index) => {
    // Prevent clicking if board is locked, card is already flipped, or card is matched
    if (lockBoard || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    // If this is the second card flipped
    if (newFlippedCards.length === 2) {
      setLockBoard(true);
      const firstCardIndex = newFlippedCards[0];
      const secondCardIndex = newFlippedCards[1];

      // Check if cards match
      if (cards[firstCardIndex] === cards[secondCardIndex]) {
        setMatchedCards([...matchedCards, firstCardIndex, secondCardIndex]);
        setFlippedCards([]);
        setLockBoard(false);

        // Check for win condition
        if (matchedCards.length + 2 === cards.length) {
          setTimeout(() => setWon(true), 300);
        }
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
          setLockBoard(false);
        }, 600);
      }
    }
  };

  const isCardFlipped = (index) => {
    return flippedCards.includes(index) || matchedCards.includes(index);
  };

  const isCardMatched = (index) => {
    return matchedCards.includes(index);
  };

  return (
    <div className="game-page-container">
      <div className="game-top-section">
        <button className="back" onClick={() => navigate('/home')}>
          Back to Home
        </button>
      </div>
      
      <div className="container">
        <h2>Memory Game</h2>
        
        <div className="game">
          {cards.map((image, index) => (
            <div
              key={index}
              className={`item ${isCardFlipped(index) ? 'boxOpen' : ''} ${isCardMatched(index) ? 'boxMatch' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <img src={image} alt={`Card ${index}`} />
            </div>
          ))}
        </div>
        
        <button className="reset" onClick={shuffleCards}>
          Reset Game
        </button>
      </div>

      {/* Win Message Modal */}
      {won && (
        <div className="win-modal" onClick={() => setWon(false)}>
          <div className="win-content" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 You Win!</h2>
            <p>Congratulations! You matched all the cards!</p>
            <button onClick={() => { setWon(false); shuffleCards(); }}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;

