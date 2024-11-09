"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, database } from '@/lib/firebase';
//import { Database } from "firebase/database";
import { Firestore } from "firebase/firestore";

interface AppContextType {
    loading: boolean;
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    database: Firestore
}

const AuthContext = createContext({} as AppContextType);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    
        return () => unsubscribe(); // Ensure unsubscribe is called correctly
    }, []);
    
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };
    
    const logout = async () => {
        await signOut(auth);
    };
    
    return (
        <AuthContext.Provider value={{ loading, user, signInWithGoogle, logout, database }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export function useDatabase() {
    return useContext(AuthContext).database;
}