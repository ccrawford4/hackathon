import {
  Database,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { CustomUser, QueryResult } from "./API";

export async function listAll(
  db: Database,
  collection: string,
  tenantId: string | null
): Promise<QueryResult[]> {
  // Ensure tenantId is provided
  if (!tenantId) {
    throw new Error("tenantId must be provided to filter the query.");
  }

  const databaseRef = ref(db, collection);

  // Create the query with orderByChild and equalTo
  const tenantQuery = query(
    databaseRef,
    orderByChild("tenantId"),
    equalTo(tenantId)
  );

  // Get the snapshot based on the query
  const snapshot = await get(tenantQuery);

  if (snapshot.exists()) {
    const data = snapshot.val();
    const entries = Object.entries(data);
    return entries.map((entry) => {
      return { id: entry[0], data: entry[1], tenantId: tenantId };
    });
  } else {
    return [];
  }
}

export async function getTenant(
  db: Database,
  name: string
): Promise<{ id: string; data: unknown } | null> {
  const tenantRef = ref(db, "tenants");
  const tenantQuery = query(tenantRef, orderByChild("name"), equalTo(name));

  const tenantSnapshot = await get(tenantQuery);
  const data = tenantSnapshot.val();

  // If no data is found, return null
  if (!data) {
    return null;
  }

  // Extract the first entry (since equalTo will match only one tenant)
  const [id, tenantData] = Object.entries(data)[0];

  return { id, data: tenantData };
}

export async function getItem(
  db: Database,
  collection: string,
  id: string
): Promise<QueryResult> {
  const databaseRef = ref(db, `${collection}/${id}`);
  const snapshot = await get(databaseRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return { id: id, data: data };
  } else {
    return { id: id, data: {} };
  }
}
export async function getUser(
  db: Database,
  email: string | null
): Promise<CustomUser> {
  if (!email) {
    throw new Error("Email must be provided.");
  }

  const userRef = ref(db, "users");
  const userQuery = query(userRef, orderByChild("email"), equalTo(email));

  try {
    const usersSnapshot = await get(userQuery);
    const data = usersSnapshot.val();

    // Check if the data exists and is not empty
    if (!data) {
      return { id: "", data: {} };
    }

    const entries = Object.entries(data);

    // Check if entries exist and return the first one
    if (entries.length === 0) {
      return { id: "", data: {} };
    }

    const [id, userData] = entries[0];

    const userDataTyped = userData as CustomUser["data"]; // Type assertion

    // Map userData to the correct structure
    const user: CustomUser = {
      id,
      data: {
        tenantId: userDataTyped.tenantId || "",
        firstName: userDataTyped.firstName || "",
        lastName: userDataTyped.lastName || "",
        email: userDataTyped.email || "",
        profileURL: userDataTyped.profileURL || "",
      },
    };
    
    return user;
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw new Error("Failed to fetch user.");
  }
}
