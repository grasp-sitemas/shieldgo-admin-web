import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Initialize Firebase
const firebaseConfig = {
    hml: {
        apiKey: 'AIzaSyAclLPx6m8m3gJuKtrbLhKrXsowbkUIb34',
        authDomain: 'shieldgo-hml.firebaseapp.com',
        projectId: 'shieldgo-hml',
        storageBucket: 'shieldgo-hml.appspot.com',
        messagingSenderId: '396522245857',
        appId: '1:396522245857:web:d41f74221e161cecc771a0',
        measurementId: 'G-2B7PBKGSSM',
    },
    prd: {
        apiKey: 'AIzaSyAdcAjt9Cdjs4vh5BTxSXcWbT0uchMcM-A',
        authDomain: 'shieldgo.firebaseapp.com',
        projectId: 'shieldgo',
        storageBucket: 'shieldgo.appspot.com',
        messagingSenderId: '569460808844',
        appId: '1:569460808844:web:14156a28a547faf8926fa9',
        measurementId: 'G-SJYL759PFQ',
    },
}

const environment = process.env.VUE_APP_IS_PRODUCTION === 'true' ? 'prd' : 'hml'

const app = initializeApp(firebaseConfig[environment])
const db = getFirestore(app)

export default db
