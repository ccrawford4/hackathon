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