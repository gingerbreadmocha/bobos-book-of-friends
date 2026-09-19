export type Cat = {
  id: string;
  name: string;
  avatarUrl: string | null;
  personality: Record<string, unknown>;
  ownerId: string;
  description: string;
  owner: { id: string; username: string };
  popularity: number;
  createdAt: string;
  updatedAt: string;
};

export type GetCatsResponse = {
  cats: Cat[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type MyCatsResponse = {
  cats: Cat[];
};

export type CreateCatInput = {
  name: string;
  avatarUrl: string | null;
  description: string;
  personality: Record<string, unknown>;
};
