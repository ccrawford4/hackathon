import {
  Database,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { CustomUser, QueryResult, Tenant } from "./API";


export async function getObject(
  db: Database,
  collection: string,
  id: string | null
): Promise<QueryResult> {
  if (!id) {
    throw new Error("ID must be provided to fetch the object.");
  }
  const databaseRef = ref(db, `${collection}/${id}`);
  const snapshot = await get(databaseRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return { id: id, data: data };
  } else {
    return { id: id, data: {} };
  }
}

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

export async function getTenantFromId(
  db: Database,
  id: string
): Promise<Tenant | null> {
  const tenantRef = ref(db, `tenants/${id}`);
  const tenantSnapshot = await get(tenantRef);
  const data = tenantSnapshot.val();

  if (!data) {
    return null;
  }

  return { id, data: data as Tenant["data"] };
}

export async function getTenant(
  db: Database,
  name: string
): Promise<Tenant | null> {
  const tenantRef = ref(db, "tenants");
  console.log("tenantRef: ", tenantRef);
  console.log("name: ", name);
  const tenantQuery = query(tenantRef, orderByChild("name"), equalTo(name));
  console.log("tenantQuery: ", tenantQuery);

  const tenantSnapshot = await get(tenantQuery);
  console.log("tenantSnapshot: ", tenantSnapshot);
  const data = tenantSnapshot.val();

  console.log("data: ", data);

  // If no data is found, return null
  if (!data) {
    return null;
  }

  // Extract the first entry (since equalTo will match only one tenant)
  const [id, tenantData] = Object.entries(data)[0];
  return { id, data: tenantData as Tenant["data"] };
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
  email: string | null,
  tenantId: string | null
): Promise<CustomUser> {
  if (!email) {
    throw new Error("Email must be provided.");
  }
  if (!tenantId) {
    throw new Error("Tenant ID must be provided.");
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
      throw new Error("No users found with that email.");
    }

    const matchingEntry = entries.find(([, userData]) => 
      (userData as CustomUser["data"]).tenantId === tenantId
    );

    if (!matchingEntry) {
      throw new Error("No users found with that email for the tenant.");
    }

    const [id, userData] = matchingEntry;
    const userDataTyped = userData as CustomUser["data"];

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
