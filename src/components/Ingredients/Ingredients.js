import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
    const[userIngredients, setUserIngredients] = useState([]);
    const[isLoading, setIsLoading] = useState(false);
    const[error, setError] = useState();

    useEffect(() => {
        console.log('Rendering ingredients', userIngredients)
    },[userIngredients]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setUserIngredients(filteredIngredients);
    },[]);

    const addIngredientHandler = (ingredient) => {
        setIsLoading(true);
        fetch('https://react-hooks-update-59122.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            setIsLoading(false);
            return response.json()
        }).then(responseData => {
            setUserIngredients(prevIngredients => {
                return [...prevIngredients, {id: responseData.name, ...ingredient}];
            })
        }).catch(error => {
            setIsLoading(false);
            setError(error.message)
        });
    };

    const removeIngredientHandler = ingredientId => {
        setIsLoading(true);
        fetch(`https://react-hooks-update-59122.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE',
        }).then(response => {
            setIsLoading(false);
            setUserIngredients(prevIngredients =>
                prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
            );
        }).catch(error => {
            setIsLoading(false);
            setError(error.message);
        });
    };

    const clearError = () => {
        setError(null);
    }
    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

            <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
            </section>
        </div>
    );
};

export default Ingredients;
