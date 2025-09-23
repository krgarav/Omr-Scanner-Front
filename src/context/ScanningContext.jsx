import { createContext, useContext, useState } from "react";

// Create context
const ScanContext = createContext();

// Provider component
export const ScanProvider = ({ children }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isPausedContext, setIsPausedContext] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  return (
    <ScanContext.Provider
      value={{
        isScanning,
        setIsScanning,
        isPausedContext,
        setIsPausedContext,
        isStarting,
        setIsStarting,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

// Custom hook for easier usage
export const useScan = () => useContext(ScanContext);
