import { Database, ref, get } from 'firebase/database';
import { Data, QueryResult, Tenant } from './API';


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

export function validTenant(tenant: string, tenants: QueryResult[]) {
    for (const entry of tenants) {
        if ((entry.data as any).name === tenant) {
            return true;
        }
    }
    return false;
}

