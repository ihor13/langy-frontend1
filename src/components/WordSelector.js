import React, { useState, useEffect } from 'react';
import '../styles/WordSelector.css'; // Adjust the path based on your project structure



const WordSelector = ({ words }) => {
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [colorPairs, setColorPairs] = useState([]);

  const handleSelect = (wordId, translation, isNative) => {
    if (selectedWord) {
      const pairColor = getUniqueColor();

      if (isNative !== selectedWord.isNative) {
        const updatedPairs = selectedPairs.filter(
          (pair) =>
            !(pair.translation.word === selectedWord.word && pair.native.word !== translation)
        );

        const isSameWord = selectedWord.id === wordId;
        const hasSameColorPair = selectedPairs.some(
          (pair) => pair.translation.word === translation && pair.native.word === selectedWord.word
        );

        if (isSameWord && hasSameColorPair) {
          // Remove color from both words in the same color
          const updatedPairsWithoutColor = selectedPairs.map((pair) => {
            if (pair.native.word === translation) {
              pair.native.color = '';
            }
            if (pair.translation.word === translation) {
              pair.translation.color = '';
            }
            return pair;
          });
          setSelectedPairs(updatedPairsWithoutColor);
        } else {
          // Add color to the new native word and translation word
          setSelectedPairs((prevSelectedPairs) => [
            ...updatedPairs,
            {
              native: { word: isNative ? translation : selectedWord.word, color: pairColor },
              translation: { word: isNative ? selectedWord.word : translation, color: pairColor },
            },
          ]);

          setColorPairs((prevColorPairs) => [...prevColorPairs, pairColor]);
        }
      }

      setSelectedWord(null);
    } else {
      setSelectedWord({ id: wordId, word: translation, isNative });
    }
  };

  const saveChoices = () => {
    // You can save the selected pairs in your preferred format (e.g., JSON)
    console.log(selectedPairs);
  };

  const getUniqueColor = () => {
    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#33A1FF', '#A1FF33'];
    const availableColors = colors.filter((color) => !colorPairs.includes(color));

    if (availableColors.length > 0) {
      return availableColors[0];
    } else {
      return colors[Math.floor(Math.random() * colors.length)];
    }
  };

  return (
    <div className="word-selector-container">
      <h2>Word Selector</h2>
      <div className="box">
        <div className="word-list left">
          <h3>Available Words</h3>
          <ul>
            {words.map((word) => (
              <li
                key={word.id}
                className={
                  (selectedWord && word.id === selectedWord.id && !pairHasColor(selectedPairs, word.native)) ? 'selected' : ''
                }
                style={{
                  backgroundColor:
                    selectedPairs.find((pair) => pair.native.word === word.native) ?
                    selectedPairs.find((pair) => pair.native.word === word.native).native.color :
                    ''
                }}
                onClick={() => handleSelect(word.id, word.native, true)}
              >
                {word.native}
              </li>
            ))}
          </ul>
        </div>
        <div className="lines">
          {selectedPairs.map((pair, index) => (
            <div key={index} className="line" style={{ backgroundColor: pair.native.color }}>
              <div className="dot"></div>
            </div>
          ))}
        </div>
        <div className="word-list right">
          <h3>Available Translations</h3>
          <ul>
            {words.map((word) => (
              <li
                key={word.id}
                className={
                  (selectedWord && word.id === selectedWord.id && !pairHasColor(selectedPairs, word.translate)) ? 'selected' : ''
                }
                style={{
                  backgroundColor:
                    selectedPairs.find((pair) => pair.translation.word === word.native) ?
                    selectedPairs.find((pair) => pair.translation.word === word.native).translation.color :
                    ''
                }}
                onClick={() => handleSelect(word.id, word.native, false)}
              >
                {word.translate}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={saveChoices}>Зберегти вибір(Save Choices)</button>
    </div>
  );
};

// Helper function to check if a pair has a color assigned
const pairHasColor = (pairs, word) => {
  return pairs.some((pair) => pair.native.word === word && pair.native.color !== '');
};

export default WordSelector;