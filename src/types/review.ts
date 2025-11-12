export type Review = {
  id: string;
  offerId: string;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  rating: number; // 0-5
  comment: string;
  date: string; // ISO string
};
