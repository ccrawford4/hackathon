"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, database } from '@/lib/firebase';
import { Database } from "firebase/database";
import { User } from "firebase/auth";
import { getUser } from "@/lib/queries";
import { createObject } from "@/lib/mutations";

interface AppContextType {
    loading: boolean;
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    database: Database;
    tenantId: string | null;
    setTenantId: (id: string | null) => void;
}

const AuthContext = createContext({} as AppContextType);

interface AuthProviderProps {
    children: ReactNode;
}

const TENANT_ID_KEY = 'app_tenant_id';

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [tenantId, setTenantIdState] = useState<string | null>(() => {
        // Initialize tenantId from localStorage during component mount
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TENANT_ID_KEY);
        }
        return null;
    });
    
    // Wrapper function to update both state and localStorage
    const setTenantId = (id: string | null) => {
        setTenantIdState(id);
        if (typeof window !== 'undefined') {
            if (id) {
                localStorage.setItem(TENANT_ID_KEY, id);
            } else {
                localStorage.removeItem(TENANT_ID_KEY);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
      
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const { displayName, email } = user;
            
            const nameParts = displayName ? displayName.split(" ") : [];
            const firstName = nameParts[0] || "";
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

            const userObject = await getUser(database, email);
            if (!userObject) {
                await createObject(database, "users", {
                    data: {
                        tenantId: tenantId,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                    }
                });
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            return await Promise.reject(error);
        }
    };
    
    const logout = async () => {
        await signOut(auth);
        // Optionally clear tenantId on logout
        // setTenantId(null);
    };
    
    return (
        <AuthContext.Provider value={{ 
            loading, 
            user, 
            signInWithGoogle, 
            logout, 
            database, 
            tenantId, 
            setTenantId 
        }}>
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