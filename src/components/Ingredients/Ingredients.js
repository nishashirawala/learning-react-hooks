import React, { useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";


const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter(ig => ig.id !== action.id);
        default:
            throw new Error('Should not get there!!');
    }
};

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...currentHttpState, loading: false};
        case 'ERROR':
            return {loading: false, error: action.errorMessage};
        case 'CLEAR_ERROR':
            return {...currentHttpState, error: null};
        default:
            throw new Error('Should not be reached!!');
    }
};

const Ingredients = () => {
    const[userIngredients, dispatch] = useReducer(ingredientReducer, [], );
    const[httpState, dispatchHttp] = useReducer(httpReducer,{loading: false, error: null} );

    useEffect(() => {
        console.log('Rendering ingredients', userIngredients)
    },[userIngredients]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        dispatch({type: 'SET', ingredients: filteredIngredients})
    },[]);

    const addIngredientHandler = (ingredient) => {
        dispatchHttp({type: 'SEND'})
        fetch('https://react-hooks-update-59122.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            dispatchHttp({type: 'RESPONSE'})
            return response.json()
        }).then(responseData => {
            dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
        }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message});
        });
    };

    const removeIngredientHandler = ingredientId => {
        dispatchHttp({type: 'SEND'})
        fetch(`https://react-hooks-update-59122.firebaseio.com/ingredients/${ingredientId}.json`, {
            method: 'DELETE',
        }).then(response => {
            dispatchHttp({type: 'RESPONSE'})
            dispatch({type: 'DELETE', id: ingredientId})
        }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message});
        });
    };

    const clearError = () => {
        dispatchHttp({type: 'CLEAR_ERROR'});
    };
    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

            <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
            </section>
        </div>
    );
};

export default Ingredients;
