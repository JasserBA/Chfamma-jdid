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
  comments: Comment[];
  shared?: boolean,
  liked?: boolean,
  createdDate: string;
  dropdownVisible: boolean;
}
interface Comment {
  username: string;
  fullname: string;
  description: string;
}
