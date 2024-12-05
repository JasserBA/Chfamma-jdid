export interface Post {
  id: number;
  username: string;
  fullname: string;
  description: string;
  media?: string;
  shares: number;
  comments: number;
  likes: number;
}
