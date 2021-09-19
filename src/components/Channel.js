import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useState, useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore';
import Message from './Message'

const Channel = ({ user = null}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const db = firebase.firestore();

    //const {uid, displayName, photoURL} = user;
    const {uid, photoURL} = user;

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

    const handleOnSubmit = async e => {
        e.preventDefault();

        const personFrom = await db.collection('users').doc(uid).get();
        const blocked = await personFrom.data().blocked;
        const nickname = await personFrom.data().nickname;
        console.log("blocked: ", blocked);
        console.log("nickname: ", nickname);
        if (db) {
            if (!blocked){
                db.collection('messages').add({
                    text: newMessage,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid,
                    nickname,
                    photoURL
                })
            } else {
                console.log("user is blocked so message didnt send");
            }
            if (newMessage.includes("corn")){
                block();
            }
        }

        // Message field empties after submitting
        setNewMessage('');
    }

    const block = async () => {
        console.log("blocked lmao");
        await updateDoc(doc(db, 'users', uid), {
            blocked: true
        })
    }

    // Clicking on a message
    const messageClick = (message) =>{
        console.log(`You clicked on a message: '${message.text}'\n...but this feature isn't implemented yet :(`);
    }

    return (
        <div>
            <div className="chat">
                <h2>Welcome!</h2>
                <p id="welcomeText">This is the start of the channel.</p>
                <ul>
                    {
                        messages.map(message => (
                            <li key={message.id} onClick={() => messageClick(message)}><Message {...message}/></li>
                        ))
                    }
                </ul>
            </div>
            <div className="sendMessage">
            <form onSubmit={handleOnSubmit}>
                <input type="text" value={newMessage} onChange={handleOnChange} placeholder="Message"/>
                <input type="submit" disable={(!newMessage).toString()} className="hideThis"/>
            </form>
            </div>
        </div>
    )
}

export default Channel
