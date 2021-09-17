import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useState, useEffect } from 'react'

const UserList = () => {
    const [users, setUsers] = useState([]);
    const db = firebase.firestore();


    useEffect(() => {
        if (db) {
            const unsubscribe = db.collection('users').onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setUsers(data);
                console.log(data);
            })
            return unsubscribe;
        }
    }, [db]);
    

    return (
        <div className="userList">
            <h2>Users</h2>
            <ul>
                {
                    users.map(user => (
                        <li key={user.id}><img src={user.photoURL} alt="Avatar" className="rounded-full mr-4" width={45} height={45}/>{user.nickname}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default UserList
