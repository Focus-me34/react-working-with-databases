import React, { useReducer } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';
import { useEffect } from 'react';
import { useCallback } from 'react';

const handleDataDispatch = (state, action) => {
  if (action.type === "DATA") {
    console.log(action.movieData);
    return { movieData: action.movieData, hasData: action.movieData.length > 0, isLoading: false, isPosting: false, error: null }
  }

  if (action.type === "LOADING") {
    return { ...state, isLoading: true }
  }

  if (action.type === "SENDING") {
    return { ...state, isPosting: true }
  }

  if (action.type === "RESET-ERROR") {
    return { ...state, error: null }
  }

  if (action.type === "SET-ERROR") {
    return { ...state, error: action.error, isLoading: false, }
  }
}

function App() {
  const [data, dataDispatch] = useReducer(handleDataDispatch, { movieData: [], hasData: false, isLoading: false, isPosting: false, error: null })

  // ! GETTING DATA FROM THE API WITH "GET" HTTP REQUEST
  const fetchMoviesHandler = useCallback(async () => {
    dataDispatch({ type: "RESET-ERROR" })
    dataDispatch({ type: "LOADING" })

    try { // ! TRY TO EXECUTE A RISKY PIECE OF CODE
      const res = await fetch("https://react-http-test-post-default-rtdb.europe-west1.firebasedatabase.app/movies.json")
      if (!res.ok) { throw new Error("Something went wrong while getting the data") } // ! HANDLING ERROR
      const data = await res.json()

      const loadedMovies = [];
      for (const key in data) { //! WE MUTATE THE DATA IN A SHAPE WE CAN WORK WITH WITH
        loadedMovies.push({
          id: key,
          title: data[key].title,
          releaseDate: data[key].releaseDate,
          openingText: data[key].openingText,
        })
      }

      dataDispatch({ type: "DATA", movieData: loadedMovies })
    } catch (error) { // ! CATCH ERROR IF THERE IS ONE
      dataDispatch({ type: "SET-ERROR", error: error })
    }
  }, [])

  // ! SENDING DATA TO THE API WITH "POST" HTTP REQUEST
  const addMovieHandler = useCallback(async (movie) => {
    dataDispatch({ type: "RESET-ERROR" })
    dataDispatch({ type: "SENDING" })

    try {
      const url = "https://react-http-test-post-default-rtdb.europe-west1.firebasedatabase.app/movies.json"
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (!res.ok) { throw new Error("Something went wrong while posting the data") } // ! HANDLING ERROR
      const data = await res.json()
      dataDispatch({ type: "DATA", movieData: data })
      fetchMoviesHandler()
    } catch (error) {
      dataDispatch({ type: "SET-ERROR", error: error })
    }
  }, [])

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler])

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
        {data.isPosting && !data.error && <p>Creating your post. Please wait..</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
