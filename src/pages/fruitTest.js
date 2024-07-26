import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FruitManager() {
  const [fruits, setFruits] = useState(['Apple', 'Banana', 'Orange', 'Grape', 'Pineapple']);
  const [inputValue, setInputValue] = useState('');

  const addFruit = async () => {
    if (inputValue) {
      setFruits(prevFruits => [inputValue, ...prevFruits]);
      setInputValue('');
    }
  };

  const deleteFruit = async () => {
    if (inputValue && fruits.includes(inputValue)) {
      setFruits(prevFruits => prevFruits.filter(fruit => fruit !== inputValue));
      setInputValue('');
    }
  };

  const handleFruit = async () => {
    await deleteFruit()
    await addFruit();
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Fruit Manager</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          placeholder="Enter fruit name"
        />
      </div>
      
      <div className="mb-4">
        <button
          onClick={handleFruit}
          className="bg-blue-500 text-white p-2 rounded mr-2"
        >
          Add Fruit
        </button>
        <button
          onClick={handleFruit}
          className="bg-red-500 text-white p-2 rounded"
        >
          Delete Fruit
        </button>
      </div>
      
      <ul className="list-disc pl-5">
        <AnimatePresence>
          {fruits.map((fruit, index) => (
            <motion.li
              key={fruit}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mb-1"
            >
              {fruit}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
