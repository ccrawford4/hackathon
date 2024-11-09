export interface Tenant {
    name: string;
}

export interface QueryResult {
    id: string;
    data: unknown;
}

export interface Data {
    name?: string;
}

export interface Meeting {
    id: string;
    data: {
      title: string;
      tags: {
        id: number;
        name: string;
        color?: string;
      }[];
      preview?: string;
    };
  }

  export interface MeetingTag {
    meetingId: string;
    tenantId: string;
    tagId: string;
  }
  
  export interface Tag {
    color: string;
    name: string;
  }
  
  export interface TagWithDetails extends Tag {
    id: string;
  }