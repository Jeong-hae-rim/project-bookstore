export type GetBooks = {
    id: number;
    category_id: number;
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
    is_liked: number;
    pub_date: string;
};

export type Getpagination = {
    totalCount: number;
    currentPage: string;
};
