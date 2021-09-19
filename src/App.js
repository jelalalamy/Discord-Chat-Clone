import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react'
import Button from './components/Button'
import Channel from './components/Channel'
import PopUp from './components/PopUp'
import UserList from './components/UserList'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKALmfA6So_nIi5lPTm279CAPWfN_TLMg",
  authDomain: "corddisc-firetrack.firebaseapp.com",
  projectId: "corddisc-firetrack",
  storageBucket: "corddisc-firetrack.appspot.com",
  messagingSenderId: "1070889245935",
  appId: "1:1070889245935:web:77d63004606761222d4f1a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const App = () => {
  // Initializing state so we don't render while connecting
  const [initializing, setInitializing] = useState(true);
  const [pop, setPop] = useState(false);
  const [user, setUser] = useState(() => auth.currentUser);
  const db = firebase.firestore();

  // Monitor signed or signed out
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user); // if user is defined we set user state to current user
      } else {
        setUser(false);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]) // only fire when initializing is updated

  // Sign in process
  const signInGoogle = async () => {
    // Retrieve Google provider object
    const provider = new firebase.auth.GoogleAuthProvider();
    // Set languageto the default browser preference
    auth.useDeviceLanguage();
    // Start sign in 
    try {
      const res = await firebase.auth().signInWithPopup(provider)
      const user2 = res.user;
      console.log(user2);
      
      // Getting all user ids and checking if the current user is new
      const snapshot = await firebase.firestore().collection('users').get()
      const documentIds = snapshot.docs.map(doc => doc.id);

      console.log(documentIds);

      // If they are new, thens set up their data
      if (!documentIds.includes(user2.uid)) {
        await setDoc(doc(db, 'users', user2.uid), {
          nickname: "New user",
          photoURL: user2.photoURL,
          blocked: false
        })
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Sign out process
  const signOut = async () => {
    try {
      auth.signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  //
  return (
    <div>
      {
        user ? (
          <div className="container">
            <div className="placeholderdiv">
              <h1>placeholder text</h1>
              <Channel user={user} />
              <Button className="but" onClick={() => setPop(!pop)} text="User"></Button>
              {pop && <PopUp user={user} stateChanger={setPop}></PopUp>}
              <Button className="but" onClick={signOut} text="Sign out"></Button>
            </div>
            <UserList></UserList>
          </div>
        ) :
          <div className="container2">
            <h1>Hey.</h1>
            <h2>I'm making my own realtime chat application.</h2>
            <Button onClick={signInGoogle} text="Sign in with Google"></Button>
          </div>
      }
    </div>
  );
}


export default App;
