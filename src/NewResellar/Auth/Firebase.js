// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0_LSKrZf0Smj9BE05JjqtdY61NVtYm5M",
  authDomain: "amaderbazarshop-cc5fa.firebaseapp.com",
  projectId: "amaderbazarshop-cc5fa",
  storageBucket: "amaderbazarshop-cc5fa.firebasestorage.app",
  messagingSenderId: "201799238175",
  appId: "1:201799238175:web:80069c7ab8bb5331cdcb2a",
  measurementId: "G-0S5DYK32KR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// export default firebase;
export default app;
