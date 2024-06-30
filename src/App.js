import React, { useState, useRef } from 'react';
import { FaBullseye, FaShieldAlt, FaHeart } from 'react-icons/fa';
import { LuSword } from 'react-icons/lu';
import generateRandomCardStats from './card-logic/CardGenerator';
import { generateRandomDefaultCard } from './card-logic/DefaultCardData';
import { toPng } from 'html-to-image';
import clipboard from 'clipboard';

function App() {
  const [card, setCard] = useState(null);
  const [isCustom, setIsCustom] = useState(true);
  const [customText, setCustomText] = useState('');
  const [customImage, setCustomImage] = useState(null);
  const cardRef = useRef();

  const handleImageUpload = (e) => {
    setCustomImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleCustomTextChange = (e) => {
    setCustomText(e.target.value);
  };

  const generateCustomCard = () => {
    const newCard = generateRandomCardStats();
    newCard.customText = customText;
    newCard.customSprite = customImage;
    setCard(newCard);
  };

  const generateDefaultCard = () => {
    const defaultCard = generateRandomDefaultCard();
    const newCard = generateRandomCardStats();
    newCard.cardName = defaultCard.name;
    newCard.cardSprite = `${process.env.PUBLIC_URL}/cardImages/${defaultCard.filePath}`;
    setCard(newCard);
  };

  const downloadCardImage = () => {
    if (cardRef.current) {
      toPng(cardRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'card.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Oops, something went wrong!', error);
        });
    }
  };

  const copyCardImageToClipboard = () => {
    if (cardRef.current) {
      toPng(cardRef.current)
        .then((dataUrl) => {
          clipboard.writeText(dataUrl)
            .then(() => {
              alert('Image copied to clipboard!');
            })
            .catch((error) => {
              console.error('Oops, something went wrong!', error);
            });
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8 flex">
        <button
          onClick={() => setIsCustom(true)}
          className={`mr-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 ${
            isCustom ? 'border-4 border-double border-black' : ''
          }`}
        >
          Use Custom Card
        </button>
        <button
          onClick={() => setIsCustom(false)}
          className={`px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 ${
            !isCustom ? 'border-4 border-double border-black' : ''
          }`}
        >
          Use Default Card
        </button>
      </div>

      {isCustom ? (
        <div className="mb-8">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}

          />

          <input
            type="text"
            placeholder="Enter Card Name"
            value={customText}
            onChange={handleCustomTextChange}
            className="mb-4 p-2 border rounded-md"
          />
          <button
            onClick={generateCustomCard}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Generate Custom Card
          </button>
        </div>
      ) : (
        <button
          onClick={generateDefaultCard}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 mb-10"
        >
          Generate New Default Card
        </button>
      )}

      {card && (
        <div>
          <div ref={cardRef} className="card bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">
              {card.cardName || "Generated Card!"}
            </h2>
            {card.customSprite ? (
              <img src={card.customSprite} alt="Custom Card Sprite" className="mb-4 mx-auto max-h-96 object-contain" />
            ) : (
              <img src={card.cardSprite} alt="Card Sprite" className="mb-4 mx-auto max-h-96 object-contain" />
            )}
            <div className="flex justify-around items-center mb-4 text-xl">
              <div className="flex items-center">
                <FaBullseye className="mr-1 text-red-500" /> {card.Accuracy}
              </div>
              <div className="flex items-center">
                <LuSword className="mr-1 text-gray-500" /> {card.Retaliation}
              </div>
              <div className="flex items-center">
                <FaShieldAlt className="mr-1 text-blue-500" /> {card.Damage}
              </div>
              <div className="flex items-center">
                <FaHeart className="mr-1 text-red-500" /> {card.HealthPoints}
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Ability:</h3>
            <p className="mb-2"><strong>If:</strong> {card.Trigger}</p>
            <p className="mb-2"><strong>Then:</strong> {card.Effect}</p>
          </div>
          <div className="mt-4 flex gap-1 justify-between w-80">
            <button
              onClick={downloadCardImage}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Download Image
            </button>
            <button
              onClick={copyCardImageToClipboard}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
