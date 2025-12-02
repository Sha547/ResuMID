import React from 'react';
import { RoastIntensity } from '../types';
import { INTENSITY_CONFIG } from '../constants';

export const IntensitySlider = ({ value, onChange, disabled }) => {
  const intensities = Object.values(RoastIntensity);
  const currentIndex = intensities.indexOf(value);

  const handleRangeChange = (e) => {
    onChange(intensities[parseInt(e.target.value)]);
  };

  const currentConfig = INTENSITY_CONFIG[value];

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-dark-card/80 backdrop-blur-sm border border-dark-border rounded-2xl shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
      <div className="flex justify-between items-center mb-6">
        <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase group-hover:text-gray-400 transition-colors">
          Analysis Intensity
        </label>
        <span className={`text-sm font-medium ${currentConfig.color} transition-all duration-300 transform group-hover:scale-105`}>
            {currentConfig.label}
        </span>
      </div>

      <div className="relative w-full h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-dark-border rounded-lg overflow-hidden">
           {/* Filled Track */}
           <div 
             className="h-full bg-gradient-to-r from-primary-light to-primary transition-all duration-300"
             style={{ width: `${(currentIndex / (intensities.length - 1)) * 100}%` }}
           ></div>
        </div>
        
        <input
          type="range"
          min="0"
          max={intensities.length - 1}
          step="1"
          value={currentIndex}
          onChange={handleRangeChange}
          disabled={disabled}
          className="relative w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {/* Custom Thumb */}
        <div 
          className="absolute h-5 w-5 bg-white rounded-full shadow-md pointer-events-none transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-primary/50"
          style={{ 
            left: `calc(${currentIndex * (100 / (intensities.length - 1))}% - 10px)` 
          }}
        >
            <div className={`absolute inset-0 rounded-full ${currentConfig.color} opacity-20 animate-ping`}></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {currentConfig.description}
        </span>
      </div>
    </div>
  );
};