import './home.css';
import { NavLink } from "react-router"

export default function Home() {
    return (
        <>
            <div className="grid-container">
                <div className="grid-item">
                    <NavLink to="/GameHub-FinalProject/tictactoe">
                        <img src="src/pages/home/img/tictactoe.png" />
                        <h2>Tic Tac Toe</h2>
                        <p>Simple and classic two-player Tic Tac Toe game played on 
                            a 3x3 grid. </p>
                    </NavLink>
                </div>
                <div className="grid-item">
                    <NavLink to="/GameHub-FinalProject/cardgame">
                        <img src="src/pages/home/img/lol.png" />
                        <h2>Memory Card Game</h2>
                        <p>A fun flipping card game 
                            inspired by League of Legends characters.</p>
                    </NavLink>
                </div>
                <div className="grid-item">
                    <NavLink to="/GameHub-FinalProject/rps">
                        <img src="src/pages/home/img/rps.png" />
                        <h2>Rock Paper Scissors</h2>
                        <p>A quick and simple Rock Paper Scissors game. 
                           to play against a friend. </p>
                        </NavLink>
                </div>
                <div className="grid-item">
                    <NavLink to="/GameHub-FinalProject/hangman">
                        <img src="src/pages/home/img/hangman.png" />
                        <h2>Hangman</h2>
                        <p>Guess the word one letter at a time 
                            before the stick figure is fully drawn!</p>
                    </NavLink>
                </div>
                <div className="grid-item">
                    <NavLink to="/GameHub-FinalProject/wordle">
                        <img src="src/pages/home/img/wordle.png" />
                        <h2>Wordle</h2>
                        <p>Guess the 5-letter word in 6 tries. 
                            Inspired by the popular word puzzle game.</p>
                    </NavLink>
                </div>
            </div>
        </>
    );
}