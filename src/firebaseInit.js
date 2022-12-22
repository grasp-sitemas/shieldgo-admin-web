import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAdcAjt9Cdjs4vh5BTxSXcWbT0uchMcM-A',
    authDomain: 'shieldgo.firebaseapp.com',
    projectId: 'shieldgo',
    storageBucket: 'shieldgo.appspot.com',
    messagingSenderId: '569460808844',
    appId: '1:569460808844:web:14156a28a547faf8926fa9',
    measurementId: 'G-SJYL759PFQ',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db
