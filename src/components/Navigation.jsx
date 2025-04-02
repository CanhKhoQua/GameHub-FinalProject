import { NavLink } from "react-router"
export default function Navigation()
{
    return(
        <>
        <nav>
            <NavLink to="/gamehub/">Home</NavLink>
            <NavLink to="/gamehub/hangman">Hangman</NavLink>
            <NavLink to="/gamehub/cardgame">Memory Card Game</NavLink>
            <NavLink to="/gamehub/rps">Rock Paper Scissors</NavLink>
            <NavLink to="/gamehub/tictactoe">Tic Tac Toe</NavLink>
            <NavLink to="/gamehub/wordle">Wordle</NavLink>
        </nav>
        </>
    )
}