export type GetBooks = {
    id: number;
    categoryId: number;
    title: string;
    img: number;
    form: string;
    isbn: string;
    summary: string;
    detail: string;
    author: string;
    contents: string;
    pages: number;
    price: number;
    likes: number;
    pubDate: string;
};

export type Getpagination = {
    totalCount: number;
    currentPage: string;
};
