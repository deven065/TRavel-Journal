function Joke(props) {
    console.log(props)
    return (
        <>
            <p>{props.setup}</p>
            <p>{props.punchline}</p>
            <hr />
        </>
    )
}

export default Joke;