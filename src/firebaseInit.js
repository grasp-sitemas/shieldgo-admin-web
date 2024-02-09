import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAclLPx6m8m3gJuKtrbLhKrXsowbkUIb34',
    authDomain: 'shieldgo-hml.firebaseapp.com',
    projectId: 'shieldgo-hml',
    storageBucket: 'shieldgo-hml.appspot.com',
    messagingSenderId: '396522245857',
    appId: '1:396522245857:web:d41f74221e161cecc771a0',
    measurementId: 'G-2B7PBKGSSM',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db
