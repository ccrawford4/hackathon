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
      tenantId: string;
      title: string;
      summary?: string;
      tagLine?: string;
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