import { initializeApp } from 'firebase/app'
import { getAuth, signOut } from 'firebase/auth'
import { addDoc, collection, getFirestore, orderBy, query, Query } from 'firebase/firestore'
import { useState } from 'react'

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import { firebaseConfig } from './config'

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {

  const [signWithGoogle] = useSignInWithGoogle(auth);
  const [value] = useCollectionData(
    query(
      collection(getFirestore(firebaseApp), 'messages'),
      orderBy('createdAt')
    )
  );
  const [user, loading, error] = useAuthState(auth);
  const [inputText, setInputText] = useState('');

  function connect() {
    signWithGoogle();
  }

  function disconnect() {
    signOut(auth);
  }

  async function sendMessage(){
    
    const {uid, photoURL, displayName} = auth.currentUser!;

    const doc = await addDoc(collection(getFirestore(firebaseApp), 'messages'), {
      text: inputText,
      createdAt: '2021',
      uid,
      photoURL,
      displayName
    });

    setInputText('');
  }

  return (
    <div className="App">

      <header>
        Icons and Signout Button

        {user?.email}
        {user && <img src={user.photoURL || 'local.jpg'}/>}
        
      </header>

      <section>
        {user ? <>
          <h4>ChatRoom</h4>
          <div>
            {value && 
              value.map((doc, index) => {
                return <p key={index}>{doc.displayName}: {doc.text}</p>
              })
            }
          </div>

          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
          <button type='button' onClick={sendMessage}>SUBMIT</button>
          
          <h6 onClick={disconnect}>Exit</h6>  
          
        </> : <h5 onClick={connect}>Press to connect</h5>}
      </section>

    </div>
  )
}

export default App
