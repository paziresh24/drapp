import { addBookToQueueHandlers } from './api/addBookToQueue';
import { booksHandlers } from './api/books';
import { removeBookHandlers } from './api/removeBook';

export const handlers = [...booksHandlers, ...addBookToQueueHandlers, ...removeBookHandlers];
