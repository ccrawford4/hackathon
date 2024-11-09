"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, database } from '@/lib/firebase';
import { Database } from "firebase/database";
import { User } from "firebase/auth";
import { getItem, getUser } from "@/lib/queries";
import { createObject } from "@/lib/mutations";

interface AppContextType {
    loading: boolean;
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    database: Database;
    tenantId: string | null;
    setTenantId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext({} as AppContextType);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [tenantId, setTenantId] = useState<string | null>(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
    
        return () => unsubscribe(); // Ensure unsubscribe is called correctly
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
      
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          const { displayName, email } = user;
          
          // Extract first name and last name from displayName (if available)
          const nameParts = displayName ? displayName.split(" ") : [];
          const firstName = nameParts[0] || "";
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
      
          console.log("First Name:", firstName);
          console.log("Last Name:", lastName);
          console.log("Email:", email);

          const userObject = await getUser(database, email);
           if (!userObject) {
            await createObject(database, "users", {
                data: {
                    tenantId: tenantId,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                }
            })
           }
      
        } catch (error) {
          // Handle errors here (e.g. sign-in failure, network error, etc.)
          console.error("Error during Google sign-in:", error);
          return await Promise.reject(error);
        }
      };
    
    const logout = async () => {
        await signOut(auth);
    };
    
    return (
        <AuthContext.Provider value={{ loading, user, signInWithGoogle, logout, database, tenantId, setTenantId }}>
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

export function useTenantId() {
    return useContext(AuthContext).tenantId;
}