import {
  Database,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { CustomUser, QueryResult, Tenant } from "./API";

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

// export async function listTenants(db: Database): Promise<QueryResult[]> {
//   const databaseRef = ref(db, "tenants");
//   const snapshot = await get(databaseRef);

//   if (snapshot.exists()) {
//     const data = snapshot.val();
//     const entries = Object.entries(data);
//     return entries.map((entry) => {
//       return { id: entry[0], data: entry[1] };
//     });
//   } else {
//     return [];
//   }
// }

export async function getTenant(db: Database, name: string): Promise<{ id: string, data: any } | null> {
  const tenantRef = ref(db, "tenants");
  const tenantQuery = query(
    tenantRef,
    orderByChild("name"),
    equalTo(name)
  );

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

  const userRef = ref(db, "users");
  const userQuery = query(
    userRef,
    orderByChild("email"),
    equalTo(email)
  );

  const usersSnapshot = await get(userQuery);
  return usersSnapshot.val();
}
