import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [name, setName] = useState('');
  const [opponentName, setOpponentName] = useState(''); // Added opponentName state

  return (
    <UserContext.Provider value={{ name, setName, opponentName, setOpponentName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
