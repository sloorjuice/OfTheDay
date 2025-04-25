import React from 'react';

const MoviesPage = () => {
    const movies = [
        { id: 1, title: 'Inception', year: 2010 },
        { id: 2, title: 'The Dark Knight', year: 2008 },
        { id: 3, title: 'Interstellar', year: 2014 },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Movies</h1>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        <strong>{movie.title}</strong> ({movie.year})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MoviesPage;