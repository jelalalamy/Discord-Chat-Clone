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
            {/* <ul>
                {
                    users.map(user => (
                        <li key={user.id}><img src={user.photoURL} alt="Avatar" className="userPic" width={45} height={45}/>{user.nickname}</li>
                    ))
                }
            </ul> */}
            {
                users.map(user=>(
                    <div className="userListUser" key={user.id}><img src={user.photoURL} alt="Avatar" className="userPic" width={40} height={40}/><span>{user.nickname}</span></div>
                ))
            }
        </div>
    )
    
}

export default UserList
