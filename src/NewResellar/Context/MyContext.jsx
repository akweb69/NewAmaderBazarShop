import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from "../Auth/Firebase";

// Firebase Auth
const auth = getAuth(app);

// Create Context
const AuthContext = createContext(null);

// Provider Component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserLoading, setCurrentUserLoading] = useState(true);

    // onAuthStateChanged
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user || null);
            setCurrentUserLoading(false);
        });

        // cleanup
        return () => unsubscribe();
    }, []);

    const finalData = {
        currentUser,
        setCurrentUser,
        currentUserLoading,
        setCurrentUserLoading,
        auth,
    };

    return (
        <AuthContext.Provider value={finalData}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => {
    return useContext(AuthContext);
};