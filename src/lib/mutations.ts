import { set, ref } from "firebase/database";
import { createUUID } from "./helpers";
import { Database } from "firebase/database";

interface Data {
    name?: string;
}

export default async function setObject(db: Database, collection: string, object: Data) {
    const id = createUUID();
    const dbRef = ref(db, `${collection}/${id}`);
    await set(dbRef, object);
}