import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Using useCallback hook to add "fetchMovieHandler" as a dependency 
  // in useEffect hook whitout the risk of infinite loop
  const fetchMovieHandler = useCallback( async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://swapi.dev/api/films')
      if ( !response.ok ) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();

      const transformdMovies = data.results.map( movieData => {
      return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date
          }
        })

        setMovies(transformdMovies);        
      } 
      catch(error) {
        setError(error.message)
      }
      setIsLoading(false);
  }, []);

  // Loading data when the app is loaded
  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>No movies found!</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
