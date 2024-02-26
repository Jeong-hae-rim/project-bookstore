export interface Book {
    [key: string]: string | number;
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
    pub_date: string;
    likes: number;
}

export interface BookDetail extends Book {
    genre: string;
    is_liked: number;
}
