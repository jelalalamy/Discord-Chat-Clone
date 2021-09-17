const Button = ({ onClick = null, text = null}) => {
    return (
        <div>
            <button onClick = {onClick}>{text}</button>
        </div>
    )
}

export default Button
