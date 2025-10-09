export interface IBlog {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
}

export interface IBlogWithAuthor extends IBlog {
    author: {
        id: number;
        name: string;
        email: string;
    };
}

export interface ICreateBlogPayload {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
}

export interface IUpdateBlogPayload {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
}
