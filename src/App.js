import React, { useReducer } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const handleDataDispatch = (state, action) => {
  if (action.type === "DATA") {
    console.log(action.movieData);
    return { movieData: action.movieData, hasData: action.movieData.length > 0 }
  }
}

function App() {
  const [data, dataDispatch] = useReducer(handleDataDispatch, { movieData: [], hasData: false })

  const fetchMoviesHandler = (movie) => {
    fetch(`https://swapi.dev/api/films/${movie}`)
      .then(res => res.json())
      .then(data => {
        const transformedMovies = data.results.map(movie => {
          return {
            id: movie.episode_id,
            title: movie.title,
            openingText: movie.opening_crawl,
            releaseDate: movie.release_date
          }
        })

        dataDispatch({ type: "DATA", movieData: transformedMovies })
      })
  }

  console.log(data);
  return (
    <React.Fragment>
      <section>
        <button onClick={() => fetchMoviesHandler("")}>Fetch Movies</button>
      </section>
      {(data.hasData === true) &&
        <section>
          <MoviesList movies={data.movieData} />
        </section>}
    </React.Fragment>
  );
}

export default App;
