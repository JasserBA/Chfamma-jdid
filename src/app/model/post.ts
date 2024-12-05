export interface Post {
  id: number;
  username: string;
  name: string;
  description: string;
  media?: string;
  shares: number;
  comments: number;
  likes: number;
}
