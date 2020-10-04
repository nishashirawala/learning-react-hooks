import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

    const{ onLoadIngredients } = props
    const[enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    useEffect(() => {
        const filterTimer = setTimeout(() => {
            if(enteredFilter === inputRef.current.value) {
                const queryParam = enteredFilter.length === 0 ? '':`?orderBy="title"&equalTo="${enteredFilter}"`;
                fetch('https://react-hooks-update-59122.firebaseio.com/ingredients.json' + queryParam)
                    .then(response => response.json())
                    .then(responseData => {
                        const loadedIngredients = [];
                        for (const key in responseData) {
                            loadedIngredients.push({id: key, title: responseData[key].title, amount: responseData[key].amount});
                        }
                        onLoadIngredients(loadedIngredients);
                    });
            }
        }, 500);
        return () => { clearTimeout(filterTimer) };
    }, [enteredFilter, onLoadIngredients, inputRef]);

    return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={enteredFilter} onChange={event => {setEnteredFilter(event.target.value)}} ref={inputRef}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
