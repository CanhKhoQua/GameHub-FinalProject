export default function Form({handleSubmit})
{
    return (
        <form className="card-wrapper">
            <button onClick={handleSubmit}>
                Start Game
            </button>
        </form>
    )
}