"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useDatabase } from "@/app/providers/AppContext";
import { getTenant } from "@/lib/queries";
import { createObject } from "@/lib/mutations";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { Google } from "@mui/icons-material";
import { darkTheme } from "@/app/theme/darkTheme";
import { QueryInput } from "@/lib/API";

export default function SignIn() {
  const { user, signInWithGoogle, setTenantId, logout } = useAuth();
  const router = useRouter();
  const db = useDatabase();

  // State to handle the tenant input and validation
  const [tenantName, setTenantName] = useState<string>("");
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
      const tenantObject = await getTenant(db, tenantName);
      if (tenantObject) {
        console.log("Tenant ID: ", tenantObject.id);
        setTenantId(tenantObject.id);
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

  const handleSignInFlow = async () => {
    try {
      if (tenantValidated) {
        await signInWithGoogle();
        router.push("/");
      } else {
        setErrorMessage("Please validate the tenant name before signing in.");
      }
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      setErrorMessage("Error during Google sign-in. Please try again.");
      logout();
      window.alert("Error! This user has not been added to the organization. Redirecting to login page...");
    }
  };

  const handleTenantRegister = async () => {
    try {
      const currentTenant = await getTenant(db, tenantName);

      if (currentTenant) {
        setErrorMessage("Tenant name already exists. Please try again.");
      } else {
        const tenantObject: QueryInput = {
          data: {
            name: tenantName,
          },
        };

        const response = await createObject(db, "tenants", tenantObject);
        if (!response) {
          throw new Error("Error creating tenant.");
        }

        setTenantId(response.id);
        setTenantValidated(true);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error registering tenant: ", error);
      setErrorMessage("Error registering tenant. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900">
        <Box className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
          <Box className="p-8 lg:p-16 flex items-center justify-center">
            <Box className="w-full max-w-md">
              <Box className="mb-8">
                <Typography
                  variant="h3"
                  className="text-white text-4xl font-bold mb-4"
                >
                  Get Started with Us
                </Typography>
                <Typography className="text-gray-400">
                  Complete these easy steps to register your account.
                </Typography>
              </Box>

              <Box className="mt-12">
                <Box
                  className={`flex items-center p-4 rounded-lg mb-3 ${
                    !tenantValidated ? "bg-white" : "bg-gray-800"
                  }`}
                >
                  <Box
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      !tenantValidated
                        ? "bg-black text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    1
                  </Box>
                  <Typography
                    className={
                      !tenantValidated ? "text-black" : "text-gray-300"
                    }
                  >
                    Enter tenant name
                  </Typography>
                </Box>
                <Box
                  className={`flex items-center p-4 rounded-lg mb-3 ${
                    tenantValidated ? "bg-white" : "bg-gray-800"
                  }`}
                >
                  <Box
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      tenantValidated
                        ? "bg-black text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    2
                  </Box>
                  <Typography
                    className={tenantValidated ? "text-black" : "text-gray-300"}
                  >
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
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
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
