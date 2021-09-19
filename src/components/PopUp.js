import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useState } from 'react'

const PopUp = ({ user = null, stateChanger }) => {
    const db = firebase.firestore();
    const [newNickname, setNewNickname] = useState('');

    const handleOnChange = e => {
        setNewNickname(e.target.value);
    };

    const handleOnSubmit = e => {
        e.preventDefault();
        db.collection('users').doc(user.uid).update({
            nickname: newNickname
        });
        stateChanger();
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => stateChanger()}>&times;</span>
                <p>This is where the user will be able to modify their profile.</p>
                <form onSubmit={handleOnSubmit}>
                    <label>Change nickname</label>
                    <input type="text" value={newNickname} onChange={handleOnChange}></input>
                    <button type="submit">Update</button>
                    <label>Change picture: coming soon</label>
                </form>
            </div>
        </div>
    )
}

export default PopUp
