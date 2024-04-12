import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gql, useLazyQuery } from '@apollo/client';

interface GlobalState {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  setUserInStorage: (userId: string) => void;
  deleteUserFromStorage: () => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider = ({ children }: GlobalStateProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);

  // Function to set user ID in AsyncStorage
  const setUserInStorage = async (userId: string) => {
    try {
      await AsyncStorage.setItem('_id', userId);
      setUserId(userId);
    } catch (error) {
      console.error('Error setting user ID in AsyncStorage:', error);
    }
  };

  const deleteUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('_id');
      setUserId(null);
    } catch (error) {
      console.error('Error deleting user ID from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('_id');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <GlobalContext.Provider value={{ userId, setUserId, setUserInStorage, deleteUserFromStorage }}>
      {children}
    </GlobalContext.Provider>
  );
};
