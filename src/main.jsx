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

function Layout()
{
  return (
  <>
  <h1>Gamehub</h1>
  <Navigation/>
  <Outlet/>
  </>
  )

}

const router = createBrowserRouter([
    {
      path: "/gamehub/",
      Component: Layout,
      children:[
        {path: "hangman", element: <Hangman/>},
        {path: "cardgame", element: <Cardgame/>},
        {path: "rps", element: <RockPaperScisor/>},
        {path: "tictactoe", element: <TicTacToe/>},
        {path: "wordle", element: <Wordle/>},
      ]
    }
  ])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
