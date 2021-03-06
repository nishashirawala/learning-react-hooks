import {useReducer, useCallback} from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    requestExtra: null,
    identifier: null
};

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null, data: null, requestExtra: null, identifier: action.identifier};
        case 'RESPONSE':
            return {...currentHttpState, loading: false, data: action.responseData, requestExtra: action.extra};
        case 'ERROR':
            return {loading: false, error: action.errorMessage};
        case 'CLEAR_ERROR' :
            return initialState;
        default:
            throw new Error('Should not be reached!!');
    }
};

const useHttp = () => {
    const[httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clearError = useCallback(() => dispatchHttp({type: 'CLEAR_ERROR'}), []);

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        dispatchHttp({type: 'SEND', identifier: reqIdentifier});
        fetch(url, {
            method: method,
            body: body,
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(responseData => {
            dispatchHttp({type: 'RESPONSE', responseData: responseData, extra: reqExtra});
        }).catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: error.message});
        });
    }, []);

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        requestExtra: httpState.requestExtra,
        requestIdentifier: httpState.identifier,
        clearError: clearError
    };
};

export default useHttp;
