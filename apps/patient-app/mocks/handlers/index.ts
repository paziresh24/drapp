import { addBookToQueueHandlers } from './api/addBookToQueue';
import { booksHandlers } from './api/books';

export const handlers = [...booksHandlers, ...addBookToQueueHandlers];
