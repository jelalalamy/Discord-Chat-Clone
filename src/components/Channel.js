import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useState, useEffect } from 'react'
import Message from './Message'

const Channel = ({ user = null}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const db = firebase.firestore();

    const {uid, displayName, photoURL} = user;

    useEffect(() => {
        if (db) {
            const unsubscribe = db.collection('messages').orderBy('createdAt').limit(100).onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setMessages(data);
            })
            return unsubscribe;
        }
    }, [db]);

    const handleOnChange = e => {
        setNewMessage(e.target.value);
    };

    const handleOnSubmit = e => {
        e.preventDefault();

        if (db) {
            db.collection('messages').add({
                text: newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                displayName,
                photoURL
            })
        }

        // Message field empties after submitting
        setNewMessage('');
    }

    // Clicking on a message
    const messageClick = (message) =>{
        console.log(`You clicked on a message: '${message.text}'\n...but this feature isn't implemented yet :(`);
    }

    return (
        <div>
            <div className="chat">
                <p>This is the start of the channel.</p>
                <ul>
                    {
                        messages.map(message => (
                            <li key={message.id} onClick={() => messageClick(message)}><Message {...message}/></li>
                        ))
                    }
                </ul>
            </div>
            <form onSubmit={handleOnSubmit}>
                <input type="text" value={newMessage} onChange={handleOnChange} placeholder="Type your message here..."/>
                <button type="submit" disable={(!newMessage).toString()}>Send</button>
            </form>
        </div>
    )
}

export default Channel
