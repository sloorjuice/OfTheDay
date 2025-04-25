import React from 'react';

const BooksPage = () => {
    const books = [
        { id: 1, title: '1984', author: 'George Orwell' },
        { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
        { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    ];

    return (
        <div>
            <h1>Books</h1>
            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <strong>{book.title}</strong> by {book.author}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BooksPage;