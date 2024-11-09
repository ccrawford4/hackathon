"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useDatabase } from '@/app/providers/AuthContext';
import { ref, get, set } from "firebase/database";

export default function SignIn() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const db = useDatabase();

  // State to handle the tenant input and validation
  const [tenant, setTenant] = useState("");
  const [tenantValidated, setTenantValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
        console.log("Already Logged In. Redirecting to home page...");
        router.push("/");
    }
  }, [user, router]);


  // Function to handle tenant name validation
  const handleTenantSubmit = async () => {
    try {
      const dbRef = ref(db, `tenants/${tenant}`);
      const snapshot = await get(dbRef); // Get the snapshot directly from the dbRef

      if (snapshot.exists()) {
          console.log("Snapshot: ", snapshot);
          setErrorMessage(""); // Clear any error message
          setTenantValidated(true); // Tenant is validated
      } else {
          setTenantValidated(false); // Tenant doesn't exist
          setErrorMessage("Invalid tenant name. Please try again.");
      }
    } catch (error) {
      console.error("Error validating tenant name: ", error);
      setTenantValidated(false);
      setErrorMessage("Error validating tenant name. Please try again.");
    }
  };

  const handleSignInFlow = () => {
    if (tenantValidated) {
        signInWithGoogle();
    } else {
      setErrorMessage("Please validate the tenant name before signing in.");
    }
  };


  const handleTenantRegister = async () => {
    try {
        const dbRef = ref(db, `tenants/${tenant}`);
        await set(dbRef, {
            name: tenant,
        });
        setTenantValidated(true);
        setErrorMessage("");
    }
    catch (error) {
        console.error("Error registering tenant: ", error);
        setErrorMessage("Error registering tenant. Please try again.");
    }
  }

  return (
    <div>
      {!tenantValidated ? (
        <div>
          <h2>Enter Tenant Name</h2>
          <input
            type="text"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            placeholder="Tenant name"
            className="border p-2 rounded mb-2"
          />
          <button
            onClick={handleTenantSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Tenant Name
          </button>
          <button onClick={handleTenantRegister} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Register a new tenant
        </button>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      ) : (
        <div>
          <button
            onClick={() => handleSignInFlow()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}