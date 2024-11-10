export interface Tenant {
  id: string;
  data: {
    name: string;
  }
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
  };
}

export interface MeetingTag {
  meetingId: string;
  tenantId: string;
  tagId: string;
}

export interface Tag {
  id: string;
  data: {
    color: string;
    name: string;
  }
}

export interface TagWithDetails extends Tag {
  id: string;
}

export interface CustomUser {
  id: string;
  data: {
    tenantId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface MeetingUser {
  id: string;
  data: {
    meetingId: string;
    userId: string;
  }
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
  member: Member;
  text: string;
}

export interface MeetingDetailsProps {
  title: string;
  categories: Category[];
  members: Member[];
  dateTime: string;
  onStart: () => void;
}

export interface MeetingChatProps {
  title: string;
  messages: Message[];
  participants: Member[];
}
