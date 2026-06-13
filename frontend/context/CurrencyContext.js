'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency] = useState('LKR');

  const toggleCurrency = () => {
    // Removed to keep it strictly LKR
  };

  const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
