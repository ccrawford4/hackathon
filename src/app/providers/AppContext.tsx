"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth, database } from "@/lib/firebase";
import { Database } from "firebase/database";
import { User } from "firebase/auth";
import { getUser } from "@/lib/queries";
import { createObject, updateObject } from "@/lib/mutations";
import * as api from "@/lib/API";

interface AppContextType {
  loading: boolean;
  user: User | null;
  signInWithGoogle: (registering: boolean) => Promise<api.CustomUser>;
  logout: () => Promise<void>;
  database: Database;
  tenantId: string | null;
  setTenantId: (id: string | null) => void;
  setUserId: (id: string | null) => void;
  userId: string | null;
}

const AuthContext = createContext({} as AppContextType);

interface AuthProviderProps {
  children: ReactNode;
}

const TENANT_ID_KEY = "app_tenant_id";
const USER_ID_KEY = "app_user_id";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantIdState] = useState<string | null>(() => {
    // Initialize tenantId from localStorage during component mount
    if (typeof window !== "undefined") {
      return localStorage.getItem(TENANT_ID_KEY);
    }
    return null;
  });

  const [userId, setUserIdState] = useState<string | null>(() => {
    // Initialize tenantId from localStorage during component mount
    if (typeof window !== "undefined") {
      return localStorage.getItem(USER_ID_KEY);
    }
    return null;
  });

  const setUserId = (id: string | null) => {
    setUserIdState(id);
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem(USER_ID_KEY, id);
      } else {
        localStorage.removeItem(USER_ID_KEY);
      }
    }
  };

  // Wrapper function to update both state and localStorage
  const setTenantId = (id: string | null) => {
    setTenantIdState(id);
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem(TENANT_ID_KEY, id);
      } else {
        localStorage.removeItem(TENANT_ID_KEY);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(firebaseUser);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (registering: boolean = false) => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { displayName, email, photoURL } = user;

      const nameParts = displayName ? displayName.split(" ") : [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      let userObject: api.CustomUser | null = null;

      // If registering, create a new user object which will act as the admin for the tenant
      if (registering) {
        userObject = await createObject(database, "users", {
          data: {
            email,
            firstName,
            lastName,
            profileURL: photoURL,
            tenantId,
            admin: true,
          },
        }) as api.CustomUser;
      } else {
        userObject = await getUser(database, email, tenantId);
      }

      // If no user was found for this tenant, then throw an error
      if (!userObject || userObject.id === "") {
        return Promise.reject(
          "No user with these credentials found for the tenant."
        );
      }

      setUserId(userObject.id);

      // If the user's first name, last name, or photo URL is empty, then update the user object
      if (
        userObject.data.firstName === "" ||
        userObject.data.lastName === "" ||
        userObject.data.profileURL === ""
      ) {
        const updatedUser = {
          ...userObject.data,
          firstName: userObject.data.firstName || firstName,
          lastName: userObject.data.lastName || lastName,
          profileURL: userObject.data.profileURL || photoURL,
        };
        await updateObject(database, "users", userObject.id, updatedUser);
      }

      return Promise.resolve(userObject);
    } catch (error) {
      await logout();
      console.error("Error during Google sign-in:", error);
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setTenantId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        signInWithGoogle,
        logout,
        database,
        tenantId,
        setTenantId,
        setUserId,
        userId,
      }}
    >
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

export function useUserId() {
  return useContext(AuthContext).userId;
}
