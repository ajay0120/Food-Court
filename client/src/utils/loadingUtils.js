import { useState } from 'react';

/**
 * Utility function to ensure minimum loading time for better UX
 * Prevents jarring quick flashes when APIs respond too fast
 * 
 * @param {Function} asyncFunction - The async function to execute
 * @param {number} minTime - Minimum time in milliseconds (default: 800ms)
 * @returns {Promise} - Promise that resolves after both async function and minimum time
 */
export const withMinimumLoadingTime = async (asyncFunction, minTime = 800) => {
  const startTime = Date.now();
  
  try {
    // Execute the async function
    const result = await asyncFunction();
    
    // Calculate elapsed time and remaining delay needed
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minTime - elapsedTime);
    
    // Wait for remaining time if function was too fast
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
    
    return result;
  } catch (error) {
    // Even on error, respect minimum loading time for consistent UX
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minTime - elapsedTime);
    
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
    
    throw error; // Re-throw the error after minimum time
  }
};

/**
 * Hook for managing loading states with minimum loading time
 * 
 * @param {number} minTime - Minimum loading time in milliseconds
 * @returns {Object} - { isLoading, executeWithMinTime }
 */
export const useMinimumLoading = (minTime = 800) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const executeWithMinTime = async (asyncFunction) => {
    setIsLoading(true);
    try {
      return await withMinimumLoadingTime(asyncFunction, minTime);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isLoading, executeWithMinTime };
};

// Predefined timing constants for different UI contexts
export const LOADING_TIMES = {
  QUICK: 500,      // For simple operations
  NORMAL: 800,     // For menu/content loading
  SLOW: 1200,      // For complex operations
  CART: 600,       // For cart operations
  PROFILE: 700,    // For profile data
  ORDERS: 900      // For order history
};
