import { set, ref } from "firebase/database";
import { createUUID } from "./helpers";
import { Database, remove } from "firebase/database";
import { QueryInput } from "./API";

export async function createObject(db: Database, collection: string, object: QueryInput) {
    const id = createUUID();
    const dbRef = ref(db, `${collection}/${id}`);
    await set(dbRef, object.data);

    return { id: id, data: object.data };
}

export async function createObjects(db: Database, collection: string, objects: QueryInput[]) {
    const promises = objects.map((object) => {
        const id = createUUID();
        console.log("object.data: ", object.data);
        const dbRef = ref(db, `${collection}/${id}`);
        return set(dbRef, object.data);  // Return each promise from set
    });

    // Wait for all promises to resolve
    const response = await Promise.all(promises);
    return response;
}

export function deleteObject(db: Database, collection: string, id: string) {
    const itemRef = ref(db, `${collection}/${id}`);
    remove(itemRef).then(() => {
        console.log("Item removed successfully!");
    })
    .catch((error) => {
        console.error("Error removing item: ", error);
    })
}