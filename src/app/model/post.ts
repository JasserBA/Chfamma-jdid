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
  shared?: boolean,
  liked?: boolean,
  createdDate: string;
  dropdownVisible: boolean;
}
