import { equalTo, orderByChild, get, query, ref, Database, DataSnapshot } from "firebase/database";
import { MeetingTag, Tag, TagWithDetails } from "./API";

export function createUUID(): string {
    let uuid = crypto.randomUUID();

    uuid = uuid.replace(/[.#$[\]]/g, '');
  
    while (uuid.length < 36) {
      uuid += crypto.randomUUID().replace(/[.#$[\]]/g, '');
    }
  
    return uuid.slice(0, 36);
  }

  export const getMeetingTags = async (
    db: Database,
    meetingId: string
  ): Promise<TagWithDetails[]> => {
    try {
        console.log("meetingId: ", meetingId);
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
        const meetingTag = child.val() as MeetingTag;
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
          ...(snapshot.val() as Tag),
        }));

      return tags;
    } catch (error) {
      console.error("Error fetching meeting tags:", error);
      throw error;
    }
  };