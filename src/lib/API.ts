export interface Tenant {
  id: string;
  data: {
    name: string;
  };
}

export interface QueryResult {
  id: string;
  data: unknown;
}

export interface QueryInput {
  data: unknown;
}

export interface Meeting {
  id: string;
  data: {
    tenantId: string;
    title: string;
    summary?: string;
    tagLine?: string;
    startAt?: string;
    createdAt?: string;
    endAt?: string;
    transcript?: string;
  };
}

export interface MeetingTag {
  id: string;
  data: {
    meetingId: string;
    tenantId: string;
    tagId: string;
  };
}

export interface Tag {
  id: string;
  data: {
    color: string;
    name: string;
  };
}

export interface TagWithDetails {
  name: string;
  color: string;
}

export interface CustomUser {
  id: string;
  data: {
    tenantId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profileURL?: string;
  };
}

export interface MeetingUser {
  id: string;
  data: {
    meetingId: string;
    userId: string;
  };
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  isSelected?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  data: {
    content: string;
    createdAt: string;
    senderId: string;
    meetingId: string;
    tenantId: string;
  }
}

export interface TenantUser {
  id: string;
  data: {
    tenantId: string;
    userId: string;
  }
}
