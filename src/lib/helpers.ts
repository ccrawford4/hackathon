import {
  equalTo,
  orderByChild,
  get,
  query,
  ref,
  Database,
  DataSnapshot,
} from "firebase/database";
import {
  CustomUser,
  MeetingUser,
  TagWithDetails,
  Message
} from "./API";

export function createUUID(): string {
  let uuid = crypto.randomUUID();

  uuid = uuid.replace(/[.#$[\]]/g, "");

  while (uuid.length < 36) {
    uuid += crypto.randomUUID().replace(/[.#$[\]]/g, "");
  }

  return uuid.slice(0, 36);
}

export const getMeetingTags = async (
  db: Database,
  meetingId: string
): Promise<TagWithDetails[]> => {
  try {
    // 1. Query meetingTags to get all entries for this meetingId
    const meetingTagsRef = ref(db, "meetingTags");
    const meetingTagsQuery = query(
      meetingTagsRef,
      orderByChild("meetingId"),
      equalTo(meetingId)
    );

    const meetingTagsSnapshot = await get(meetingTagsQuery);

    if (!meetingTagsSnapshot.exists()) {
      console.log("No meeting tags found for meetingId:", meetingId);
      return [];
    }

    // 2. Get all tagIds from the meetingTags entries
    const tagPromises: Promise<DataSnapshot>[] = [];
    const tagIds = new Set<string>();

    meetingTagsSnapshot.forEach((child) => {
      const meetingTag = child.val();
      console.log("Meeting tag:", meetingTag);
      if (meetingTag.tagId) {
        tagIds.add(meetingTag.tagId);
        // Get tag details for each tagId
        const tagRef = ref(db, `tags/${meetingTag.tagId}`);
        tagPromises.push(get(tagRef));
      }
    });

    // 3. Fetch all tag details in parallel
    const tagSnapshots = await Promise.all(tagPromises);

    // 4. Combine the data
    const tags: TagWithDetails[] = tagSnapshots
      .filter((snapshot) => snapshot.exists())
      .map((snapshot) => ({
        ...(snapshot.val() as TagWithDetails),
      }));

    return tags;
  } catch (error) {
    console.error("Error fetching meeting tags:", error);
    throw error;
  }
};

export const getUsers = async (db: Database, tenantId: string): Promise<CustomUser[] | null> => {
  // Reference to the 'users' node in the database
  const usersRef = ref(db, "users");

  // Query users where 'tenantId' equals the specified tenantId
  const usersQuery = query(usersRef, orderByChild("tenantId"), equalTo(tenantId));

  // Get the snapshot of the query result
  const usersSnapshot = await get(usersQuery);

  // Extract the user objects from the snapshot
  const users = Object.entries(usersSnapshot.val()).map(([id, userData]) => ({
    id,
    data: userData as CustomUser["data"],
  }));

  return users;
}

export const getMeetingUsers = async (db: Database, meetingId: string) => {
  // Reference to the 'meetingUsers' node in the database
  const meetingUsersRef = ref(db, "meetingUsers");

  console.log("Meeting id: ", meetingId);
  // Query meetingUsers where 'meetingId' equals the specified meetingId
  const meetingUsersQuery = query(
    meetingUsersRef,
    orderByChild("meetingId"),
    equalTo(meetingId)
  );

  // Get the snapshot of the query result
  const meetingUsersSnapshot = await get(meetingUsersQuery);

  console.log("meetingUsersSnapshot: ", meetingUsersSnapshot);
  const data = meetingUsersSnapshot.val() as MeetingUser;

  console.log("Data: ", data);

  if (!data) {
    // If no meetingUsers are found, return an empty array
    return [];
  }

  // Extract all userIds from the meetingUser objects
  const userIds = Object.values(data).map((meetingUser) => meetingUser.userId);

  console.log("userIds: ", userIds);

  // Fetch user data for each userId individually
  const users: CustomUser[] = [];

  for (const userId of userIds) {
    const userRef = ref(db, `users/${userId}`);
    const userSnapshot = await get(userRef);

    console.log("userSnapshot: ", userSnapshot);

    console.log("userSnapshot.val(): ", userSnapshot.val());

    if (userSnapshot.exists()) {
      users.push({
        id: userId,
        data: userSnapshot.val(),
      });
    }
  }

  console.log("users: ", users);

  // Return the collection of user objects
  return users;
};

export const getMeetingMessages = async (db: Database, meetingId: string): Promise<Message[]> => {
  // Reference to the 'messages' node in the database
  const messagesRef = ref(db, 'messages');

  console.log("Meeting id: ", meetingId);
  
  // Query messages where 'meetingId' equals the specified meetingId
  const messagesQuery = query(messagesRef, orderByChild('meetingId'), equalTo(meetingId));

  try {
    // Get the snapshot of the query result
    const messagesSnapshot = await get(messagesQuery);

    console.log("messagesSnapshot: ", messagesSnapshot);

    const data = messagesSnapshot.val();

    if (!data) {
      // If no messages are found, return an empty array
      return [];
    }

    // Transform data into an array of messages
    const messagesList = Object.entries(data).map(([id, messageData]) => ({
      id,
      data: messageData, // Assuming messageData contains the actual message fields like text, etc.
    } as Message));

    console.log("Messages: ", messagesList);

    return messagesList;

  } catch (error) {
    console.error("Error fetching messages: ", error);
    return []; // Return an empty array in case of an error
  }
};

export const getMeetingObject = async (db: Database, userID: string) => {
  // Reference to the 'meetingUsers' node in the database
  const meetingUsersRef = ref(db, "meetingUsers");

  // Query meetingUsers where 'meetingId' equals the specified meetingId
  const meetingUsersQuery = query(
    meetingUsersRef,
    orderByChild("userId"),
    equalTo(userID) 
  );

  // Get the snapshot of the query result
  const meetingUsersSnapshot = await get(meetingUsersQuery);

  const data = meetingUsersSnapshot.val() as MeetingUser;
  console.log("Data: ", data);

  if (!data) {
    return [];
  } 
  const meetingIds = Object.values(data).map((meetingUser) => meetingUser.meetingId);
  console.log("meetingIds: ", meetingIds);
  return meetingIds;
};