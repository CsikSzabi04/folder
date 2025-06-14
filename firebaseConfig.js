import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyCusAB3YTweo4WGKFyxM-HY4C1oX0M0s1c",
    authDomain: "uzenet-5bd02.firebaseapp.com",
    projectId: "uzenet-5bd02",
    storageBucket: "uzenet-5bd02.firebasestorage.app",
    messagingSenderId: "1095524662450",
    appId: "1:1095524662450:web:952188ead57b52f5605dab"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app); 

export const storage = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /folders/{folderId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /connections/{connectionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}

service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`;

