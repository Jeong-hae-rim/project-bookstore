export interface Order {
    id: number;
    book_title: string;
    total_amount: number;
    total_price: number;
    user_id: number;
    delivery_id: number;
}

export interface Delivery {
    id: number;
    address: string;
    receiver: string;
    contact: string;
}

export interface OrderedBooks {
    id: number;
    order_id: number;
    book_id: number;
    amount: number;
}

export interface OrdersDetail {
    id: number;
    book_title: string;
    total_amount: number;
    total_price: number;
    receiver: string;
    contact: string;
    address: string;
}

export interface OrderDetail {
    id: number;
    book_id: number;
    title: string;
    author: string;
    price: number;
    amount: number;
}
