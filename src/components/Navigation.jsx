import { NavLink } from "react-router"
export default function Navigation()
{
    return(
        <>
        <nav>
            <NavLink to="/GameHub-FinalProject/">Home</NavLink>
            <NavLink to="/GameHub-FinalProject/hangman">Hangman</NavLink>
            <NavLink to="/GameHub-FinalProject/cardgame">Memory Card Game</NavLink>
            <NavLink to="/GameHub-FinalProject/rps">Rock Paper Scissors</NavLink>
            <NavLink to="/GameHub-FinalProject/tictactoe">Tic Tac Toe</NavLink>
            <NavLink to="/GameHub-FinalProject/wordle">Wordle</NavLink>
        </nav>
        </>
    )
}