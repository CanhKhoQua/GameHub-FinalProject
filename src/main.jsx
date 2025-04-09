import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router'
import Navigation from './components/navigation.jsx'
import Hangman from './pages/hangman/hangman.jsx'
import Cardgame from './pages/memorycardgame/cardgame.jsx'
import RockPaperScisor from './pages/rps/rps.jsx'
import TicTacToe from './pages/tictactoe/tictactoe.jsx'
import Wordle from './pages/wordle/wordle.jsx'
import { UserProvider, useUser } from './UserContext.jsx' // ✅ Import context

// ✅ Layout can now use user context
function Layout() {
  const { name, setName } = useUser();

  return (
    <>
      <h1>Gamehub</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Enter your name:&nbsp;
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ padding: '0.5rem', borderRadius: '5px' }}
          />
        </label>
      </div>
      <Navigation />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/GameHub-FinalProject/",
    Component: Layout,
    children: [
      { path: "hangman", element: <Hangman /> },
      { path: "cardgame", element: <Cardgame /> },
      { path: "rps", element: <RockPaperScisor /> },
      { path: "tictactoe", element: <TicTacToe /> },
      { path: "wordle", element: <Wordle /> },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> {/* ✅ Wrap with context provider */}
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
);

