export interface Post {
  id: string,
  username: string;
  fullname: string;
  description: string;
  media?: string;
  interactions: {
    shares: number;
    comments: number;
    likes: number;
  };
  liked?: boolean,
  createdDate: string;
}
