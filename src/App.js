import React, { useReducer } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';
import { useEffect } from 'react';
import { useCallback } from 'react';

const handleDataDispatch = (state, action) => {
  if (action.type === "DATA") {
    console.log(action.movieData);
    return { movieData: action.movieData, hasData: action.movieData.length > 0, isLoading: false, error: null }
  }

  if (action.type === "LOADING") {
    return { ...state, isLoading: true }
  }

  if (action.type === "RESET-ERROR") {
    return { ...state, error: null }
  }

  if (action.type === "SET-ERROR") {
    return { ...state, error: action.error, isLoading: false, }
  }
}

function App() {
  const [data, dataDispatch] = useReducer(handleDataDispatch, { movieData: [], hasData: false, isLoading: false, error: null })

  const fetchMoviesHandler = useCallback(async () => {
    dataDispatch({ type: "RESET-ERROR" })
    dataDispatch({ type: "LOADING" })

    try { // ! TRY TO EXECUTE A RISKY PIECE OF CODE
      const res = await fetch(`https://swapi.dev/api/films/`)
      console.log(res);
      if (res.status === 404) { throw new Error("This endpoint doesn't exist. Double check your fetch URL and try again.") } // ! HANDLING ERROR
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
    } catch (error) { // ! CATCH ERROR IF THERE IS ONE
      dataDispatch({ type: "SET-ERROR", error: error })
      console.log(error);
    }
  }, [])

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler])

  function addMovieHandler(movie) {
    console.log(movie);
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}></AddMovie>
      </section>
      <section>
        <button onClick={() => fetchMoviesHandler("")}>Fetch Movies</button>
      </section>
      <section>
        {data.hasData && !data.error && <MoviesList movies={data.movieData} />}
        {data.isLoading && <p>Loading.. Please wait</p>}
        {!data.hasData && !data.isLoading && !data.error && <p>Found no movies</p>}
        {!data.hasData && !data.isLoading && data.error && <p><strong>AN ERROR OCCURED:</strong> <br /> {data.error.message}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
