import { Database, ref, get } from 'firebase/database';
import { QueryResult, Tenant } from './API';


export async function listAll(db: Database, collection: string): Promise<QueryResult[]> {
    const databaseRef = ref(db, collection);
    const snapshot = await get(databaseRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        const entries = Object.entries(data);
        return entries.map((entry) => { return { id: entry[0], data: entry[1] } });
    } else {
        return [];
    }
}

export async function getItem(db: Database, collection: string, id: string): Promise<QueryResult> {
    const databaseRef = ref(db, `${collection}/${id}`);
    const snapshot = await get(databaseRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        return { id: id, data: data };
    } else {
        return { id: id, data: {} };
    }
}

export function validTenant(tenant: string, tenants: QueryResult[]) {
    for (const entry of tenants) {
        if ((entry.data as Tenant).name === tenant) {
            return true;
        }
    }
    return false;
}

