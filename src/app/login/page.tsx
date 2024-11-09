"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useDatabase } from "@/app/providers/AppContext";
import { listAll, validTenant } from "@/lib/queries";
import { Tenant } from "@/lib/API";
import setObject from "@/lib/mutations";
import { useAuth, useDatabase } from '@/app/providers/AppContext';
import { ref, get, set } from "firebase/database";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Google } from '@mui/icons-material';
import { darkTheme } from '@/app/theme/darkTheme';

export default function SignIn() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const db = useDatabase();

  // State to handle the tenant input and validation
  const [tenant, setTenant] = useState<string>("");
  const [tenantValidated, setTenantValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      console.log("Already Logged In. Redirecting to home page...");
      router.push("/");
    }
  }, [user, router]);

  const validateTenant = async () => {
    const tenantsData = await listAll(db, "tenants");
    return validTenant(tenant, tenantsData as [string, Tenant][]);
  };

  // Function to handle tenant name validation
  const handleTenantSubmit = async () => {
    try {
      const validTenant = await validateTenant();

      if (validTenant) {
        setTenantValidated(true);
        setErrorMessage("");
      } else {
        setTenantValidated(false);
        setErrorMessage("Tenant name not found. Please try again.");
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
      const currentTenant = await validateTenant();

      if (currentTenant) {
        setErrorMessage("Tenant name already exists. Please try again.");
      } else {
        await setObject(db, "tenants", { name: tenant });
        setTenantValidated(true);
        setErrorMessage("");
      }

    } catch (error) {
      console.error("Error registering tenant: ", error);
      setErrorMessage("Error registering tenant. Please try again.");
    }
  };

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
          <button
            onClick={handleTenantRegister}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900">
        <Box className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
          <Box className="p-8 lg:p-16 flex items-center justify-center">
            <Box className="w-full max-w-md">
              <Box className="mb-8">
                <Typography variant="h3" className="text-white text-4xl font-bold mb-4">
                  Get Started with Us
                </Typography>
                <Typography className="text-gray-400">
                  Complete these easy steps to register your account.
                </Typography>
              </Box>

              <Box className="mt-12">
                <Box className={`flex items-center p-4 rounded-lg mb-3 ${!tenantValidated ? 'bg-white' : 'bg-gray-800'}`}>
                  <Box className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${!tenantValidated ? 'bg-black text-white' : 'bg-gray-700 text-gray-300'}`}>
                    1
                  </Box>
                  <Typography className={!tenantValidated ? 'text-black' : 'text-gray-300'}>
                    Enter tenant name
                  </Typography>
                </Box>
                <Box className={`flex items-center p-4 rounded-lg mb-3 ${tenantValidated ? 'bg-white' : 'bg-gray-800'}`}>
                  <Box className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${tenantValidated ? 'bg-black text-white' : 'bg-gray-700 text-gray-300'}`}>
                    2
                  </Box>
                  <Typography className={tenantValidated ? 'text-black' : 'text-gray-300'}>
                    Sign in with provider
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="bg-gray-900 p-8 lg:p-16 flex items-center justify-center">
            <Box className="w-full max-w-md">
              <Typography variant="h4" className="text-white font-bold mb-2">
                Sign Up Account
              </Typography>
              <Typography className="text-gray-400 mb-8">
                {!tenantValidated
                  ? "Enter your tenant name to get started."
                  : "Choose your sign in method."}
              </Typography>

              {errorMessage && (
                <Alert severity="error" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              {!tenantValidated ? (
                <Box className="space-y-6">
                  <TextField
                    fullWidth
                    label="Tenant Name"
                    value={tenant}
                    onChange={(e) => setTenant(e.target.value)}
                    className="bg-gray-800 rounded-lg"
                  />

                  <Box className="grid grid-cols-2 gap-4">
                    <Button
                      variant="contained"
                      onClick={handleTenantSubmit}
                      className="bg-white text-black hover:bg-gray-100"
                    >
                      Validate Tenant
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={handleTenantRegister}
                      className="border-gray-400 text-white hover:bg-gray-800"
                    >
                      Register New Tenant
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Google />}
                  onClick={handleSignInFlow}
                  fullWidth
                  className="bg-white text-black hover:bg-gray-100 py-3"
                >
                  Sign in with Google
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
