import React from 'react'

const UserButton = ({ onClick = null }) => {
    return (
        <div>
            <button onClick={onClick}>User</button>
        </div>
    )
}

export default UserButton
