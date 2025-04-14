export default function Hangman()
{
    return (
        <div className="hm-container">
            <div className="hangman-box">
                <img src="./hangman/assets/hangman-0.svg"></img>
                <h1>Hangman</h1>
            </div>
            <div className="game-box">
                <ul className="word-display">
                    <li className="letter"></li>
                    <li className="letter"></li>
                    <li className="letter"></li>
                    <li className="letter"></li>
                    <li className="letter"></li>
                    <li className="letter"></li>
                    <li className="letter"></li>
                </ul>
                <h4 className="guess-text">
                    Incorrect guesses:
                    <b>0 / 6</b>
                </h4>
                <div className="keyboard">
                    <button>a</button>
                </div>
            </div>
        </div>
    )
}

