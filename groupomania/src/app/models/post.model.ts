export class Post {
    _id!: string;
    title!: string;
    description!: string;
    likes!: number;
    dislikes!: number;
    imageUrl!: string;
    usersLiked!: string[];
    usersDisliked!: string[];
    userId!: string;
    userPseudo!: string;
  }
