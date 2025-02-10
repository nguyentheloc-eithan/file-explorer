import { useState } from 'react';

interface RecommendInputProps {
  recommendations: string[];
  placeholder?: string;
  className?: string;
}

const RecommendInput = ({
  recommendations = [],
  placeholder = 'Enter values...',
  className = '',
}: RecommendInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleRecommendationClick = (value: string) => {
    if (inputValue === '') {
      setInputValue(value);
    } else {
      const values = inputValue.split(',').map((v) => v.trim());
      if (!values.includes(value)) {
        setInputValue((prevValue) => `${prevValue}, ${value}`);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${className}`}
      />

      <div className="flex flex-wrap gap-2">
        {recommendations.map((recommendation) => (
          <button
            key={recommendation}
            onClick={() => handleRecommendationClick(recommendation)}
            className="px-3 py-1 text-sm transition-colors bg-gray-100 rounded-full hover:bg-gray-200">
            {recommendation}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecommendInput;
