interface BookMapping {
    id: number;
    category_id?: number;
    book_id?: number;
    title: string;
    img?: number;
    form?: string;
    isbn?: string;
    summary?: string;
    detail?: string;
    author?: string;
    contents?: string;
    pages?: number;
    price?: number;
    likes?: number;
    pub_date?: string;
    amount?: string;
    book_title?: string;
    created_at?: string;
}

export function formatData(result: BookMapping) {
    return {
        id: result.id,
        title: result.title || result.book_title, // 'title' 또는 'book_title' 중 하나를 사용
        createdAt: result.created_at,
        categoryId: result.category_id,
        img: result.img,
        form: result.form,
        isbn: result.isbn,
        summary: result.summary,
        detail: result.detail,
        author: result.author,
        contents: result.contents,
        pages: result.pages,
        price: result.price,
        likes: result.likes,
        pubDate: result.pub_date,
    };
}
