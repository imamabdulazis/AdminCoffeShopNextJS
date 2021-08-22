import React, { useEffect, useReducer } from "react";

const AddCartContext = React.createContext()

const initialState = {
    drinks: [],
    user: null,
    payment: null,
    total:0,
}

function cartReducer(state = initialState, action) {
    switch (action.type) {
        case "ADD_CART": {
            return {
                ...state,
                drinks: action.drinks,
                user: action.user,
                payment: action.payment,
                total:action.total,
            }
        }
        case "DELETE_CART": {
            return {
                ...initialState
            }
        }
        default:
            return state;
    }
}

const AddCartProvider = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, initialState);

    const value = { state, dispatch };

    return (
        <AddCartContext.Provider value={value}>
            {children}
        </AddCartContext.Provider>
    )
}




export { AddCartProvider, AddCartContext };