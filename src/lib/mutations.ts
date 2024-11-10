import { set, ref } from "firebase/database";
import { createUUID } from "./helpers";
import { Database, remove, update } from "firebase/database";
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
    console.log("id: ", id);
    const itemRef = ref(db, `${collection}/${id}`);
    remove(itemRef).then(() => {
        console.log("Item removed successfully!");
    })
    .catch((error) => {
        console.error("Error removing item: ", error);
    })
}
export function deleteObjects(db: Database, collection: string, ids: string[]) {
    ids.forEach(id => {
        console.log("Deleting id: ", id);
        const itemRef = ref(db, `${collection}/${id}`);
        remove(itemRef)
            .then(() => {
                console.log(`Item with id ${id} removed successfully!`);
            })
            .catch((error) => {
                console.error(`Error removing item with id ${id}: `, error);
            });
    });
}

/**
 * Updates an object in the Firebase Realtime Database
 * @param db Firebase database instance
 * @param collection The collection/path in the database
 * @param id The ID of the object to update
 * @param data The data to update
 * @returns Promise that resolves when the update is complete
 */
export const updateObject = async (
    db: Database,
    collection: string,
    id: string,
    data: Record<string, any>
): Promise<void> => {
    try {
        // Create a reference to the specific object
        const objectRef = ref(db, `${collection}/${id}`);
        
        // Create updates object with timestamp
        const updates = {
            ...data,
            updatedAt: new Date().toISOString()
        };

        // Perform the update
        await update(objectRef, updates);
    } catch (error) {
        console.error(`Error updating ${collection}/${id}:`, error);
        throw new Error(`Failed to update ${collection}/${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

/**
 * Updates multiple objects in the Firebase Realtime Database atomically
 * @param db Firebase database instance
 * @param updates Object containing paths and their updates
 * @returns Promise that resolves when all updates are complete
 */
export const updateMultipleObjects = async (
    db: Database,
    updates: Record<string, any>
): Promise<void> => {
    try {
        // Create a reference to the root
        const rootRef = ref(db);
        
        // Add timestamps to all updates
        const updatesWithTimestamp = Object.entries(updates).reduce((acc, [path, data]) => {
            acc[path] = {
                ...data,
                updatedAt: new Date().toISOString()
            };
            return acc;
        }, {} as Record<string, any>);

        // Perform multiple updates atomically
        await update(rootRef, updatesWithTimestamp);
    } catch (error) {
        console.error('Error updating multiple objects:', error);
        throw new Error(`Failed to update multiple objects: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

/**
 * Helper function to batch update related objects
 * @param db Firebase database instance
 * @param updates Array of update operations
 * @returns Promise that resolves when all updates are complete
 */
export const batchUpdate = async (
    db: Database,
    updates: Array<{
        collection: string;
        id: string;
        data: Record<string, any>;
    }>
): Promise<void> => {
    try {
        // Convert array of updates to a single updates object
        const batchUpdates = updates.reduce((acc, update) => {
            acc[`${update.collection}/${update.id}`] = {
                ...update.data,
                updatedAt: new Date().toISOString()
            };
            return acc;
        }, {} as Record<string, any>);

        // Perform the batch update
        await updateMultipleObjects(db, batchUpdates);
    } catch (error) {
        console.error('Error performing batch update:', error);
        throw new Error(`Failed to perform batch update: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};