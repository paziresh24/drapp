import create from 'zustand';

export const useBookStore = create((set: any) => ({
    books: [],
    addBooks: (books: any) => {
        set(state => ({
            books: [...state.books, ...books]
        }));
    },
    removeBook: ({ bookId }) => {
        set(state => ({
            books: state.books.filter(book => book.id !== bookId)
        }));
    }
}));
