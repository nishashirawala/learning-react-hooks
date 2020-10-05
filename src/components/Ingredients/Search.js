import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo(props => {

    const{ onLoadIngredients } = props
    const[enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();
    const { isLoading, data, error, sendRequest, clearError } = useHttp();

    useEffect(() => {
        const filterTimer = setTimeout(() => {
            if(enteredFilter === inputRef.current.value) {
                const queryParam = enteredFilter.length === 0 ? '':`?orderBy="title"&equalTo="${enteredFilter}"`;

                sendRequest('https://react-hooks-update-59122.firebaseio.com/ingredients.json' + queryParam, 'GET');


            }
        }, 500);
        return () => { clearTimeout(filterTimer) };
    }, [enteredFilter, inputRef, sendRequest]);

    useEffect(() => {
        if(!isLoading && !error && data) {
            const loadedIngredients = [];
            for (const key in data) {
                loadedIngredients.push({id: key, title: data[key].title, amount: data[key].amount});
            }
            onLoadIngredients(loadedIngredients)
        }
    }, [data, isLoading, error, onLoadIngredients]);
    return (
    <section className="search">
        {error && <ErrorModal onClose={clearError}>{error.message}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
            {isLoading && <span>Loading..</span>}
          <input type="text" value={enteredFilter} onChange={event => {setEnteredFilter(event.target.value)}} ref={inputRef}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
