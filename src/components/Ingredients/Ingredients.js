import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from "../UI/ErrorModal";
import useHttp from '../../hooks/http';


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



const Ingredients = () => {
    const[userIngredients, dispatch] = useReducer(ingredientReducer, [], );

    const { isLoading, data, error, sendRequest, requestExtra, requestIdentifier, clearError } = useHttp();

    useEffect(() => {
        // console.log('Rendering ingredients', userIngredients)
        if(!isLoading && !error && requestIdentifier === 'REMOVE_INGREDIENT') {
            dispatch({type: 'DELETE', id: requestExtra});
        } else if(!isLoading && !error && requestIdentifier === 'ADD_INGREDIENT') {
            dispatch({type: 'ADD', ingredient: {id: data.name, ...requestExtra}})
        }

    },[data, requestExtra, requestIdentifier, isLoading, error]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        dispatch({type: 'SET', ingredients: filteredIngredients})
    },[]);

    const addIngredientHandler = useCallback((ingredient) => {
        sendRequest('https://react-hooks-update-59122.firebaseio.com/ingredients.json',
                    'POST',
                    JSON.stringify(ingredient),
                    ingredient,
                    'ADD_INGREDIENT');
    }, [sendRequest]);

    const removeIngredientHandler = useCallback(ingredientId => {
        sendRequest(`https://react-hooks-update-59122.firebaseio.com/ingredients/${ingredientId}.json`,'DELETE', null, ingredientId, 'REMOVE_INGREDIENT');
    }, [sendRequest]);

    const ingredientList = useMemo(() => {
        return (
            <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
        )
    }, [userIngredients, removeIngredientHandler]);

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

            <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                {ingredientList}
            </section>
        </div>
    );
};

export default Ingredients;
