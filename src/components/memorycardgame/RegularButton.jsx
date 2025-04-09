export default function RegularButton({children, handleClick})
{
    return (
        <button className="btn card-btn"
                onClick={handleClick}>
                    {children}
                </button>
    )
}