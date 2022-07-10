import React, { useReducer } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

const handleDataDispatch = (state, action) => {
  if (action.type === "DATA") {
    console.log(action.movieData);
    return { movieData: action.movieData, hasData: action.movieData.length > 0, isLoading: false }
  }

  if (action.type === "LOADING") {
    return { ...state, isLoading: true }
  }
}

function App() {
  const [data, dataDispatch] = useReducer(handleDataDispatch, { movieData: [], hasData: false, isLoading: false })

  const fetchMoviesHandler = async (movie) => {
    dataDispatch({ type: "LOADING" })
    const res = await fetch(`https://swapi.dev/api/films/${movie}`)
    const data = await res.json()

    const transformedMovies = data.results.map(movie => {
      return {
        id: movie.episode_id,
        title: movie.title,
        openingText: movie.opening_crawl,
        releaseDate: movie.release_date
      }
    })
    dataDispatch({ type: "DATA", movieData: transformedMovies })
  }

  console.log(data);
  return (
    <React.Fragment>
      <section>
        <button onClick={() => fetchMoviesHandler("")}>Fetch Movies</button>
      </section>
      <section>
        {(data.hasData) && <MoviesList movies={data.movieData} />}
        {(data.isLoading) && <p>Loading.. Please wait</p>}
        { !data.hasData && !data.isLoading && <p>Found no movies</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
