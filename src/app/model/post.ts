export interface Post {
  id: number;
  username: string;
  fullname: string;
  description: string;
  media?: string;
  interactions: {
    shares: number;
    comments: number;
    likes: number;
  };
  likes: number;
  liked?: boolean;
}
