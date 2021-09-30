export interface IPost {
  _id: string;
  creator: string;
  title: string;
  content: string;
  imagePath?: string | null;
}
