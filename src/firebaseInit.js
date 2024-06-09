import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getRemoteConfig, fetchAndActivate } from 'firebase/remote-config'

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

// Initialize Firebase
const app = initializeApp(firebaseConfig[environment])

// Firestore
const db = getFirestore(app)

// Remote Config
const remoteConfig = getRemoteConfig(app)
remoteConfig.settings.minimumFetchIntervalMillis = 3600000
remoteConfig.defaultConfig = {
    google_play_store_url: 'https://play.google.com/store/apps/details?id=com.shieldgo.app&hl=pt_BR',
}

// Fetch and activate remote config
fetchAndActivate(remoteConfig)
    .then(() => {
        console.log('Remote Config fetched and activated')
    })
    .catch(err => {
        console.error('Error fetching and activating remote config:', err)
    })

console.log('Firebase initialized:', app)
console.log('Firestore initialized:', db)
console.log('Remote Config initialized:', remoteConfig)

export { db, remoteConfig }
