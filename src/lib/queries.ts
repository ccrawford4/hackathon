import { Database, ref, get } from 'firebase/database';
import { Tenant } from './API';

export async function listAll(db: Database, collection: string) {
    const databaseRef = ref(db, collection);
    const snapshot = await get(databaseRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.entries(data);
    } else {
        return null;
    }
}

export function validTenant(tenant: string, tenants: [string, Tenant][]) {
    for (const [key, tenantData] of tenants) {
        console.log(key);
        if (tenantData.name === tenant) {
            return true;
        }
    }
    return false;
}

