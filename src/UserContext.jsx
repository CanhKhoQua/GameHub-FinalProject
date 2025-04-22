import { createContext, useContext, useState } from 'react';

// Create a new context for storing user data (in this case, the user's name)
const UserContext = createContext();

// This component wraps around the parts of the app that need access to the user's name
export function UserProvider({ children }) {
  // useState hook to hold and update the user's name
  const [name, setName] = useState('');

  return (
    // Provide the name and setName function to all child components via context
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to easily access the UserContext in any component
export function useUser() {
  return useContext(UserContext);
}

