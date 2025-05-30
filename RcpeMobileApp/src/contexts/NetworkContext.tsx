import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

interface NetworkContextType {
  isConnected: boolean | null; // null initially, then true/false
  isInternetReachable: boolean | null; // Specifically for internet reachability
  type: NetInfoState['type'] | null;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkContextType>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    const unsubscribe: NetInfoSubscription = NetInfo.addEventListener(state => {
      console.log('Network state changed:', state);
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });

      // Example of a simple global reaction (could be a toast, banner, etc.)
      if (state.isConnected === false) {
        // Alert.alert("Offline", "You are currently offline. Some features may be unavailable.");
        console.warn("App is offline.");
      } else if (state.isConnected === true && networkState.isConnected === false) {
        // Only show "back online" if previous state was offline
        // Alert.alert("Online", "You are back online.");
        console.log("App is back online.");
      }
    });

    // Initial check
    NetInfo.fetch().then(state => {
        console.log('Initial network state:', state);
        setNetworkState({
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
        });
    });

    return () => {
      unsubscribe();
    };
  }, [networkState.isConnected]); // Re-run effect if isConnected changed to show "back online" correctly

  return (
    <NetworkContext.Provider value={networkState}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
