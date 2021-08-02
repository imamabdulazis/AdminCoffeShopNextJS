import React, { useEffect, useReducer } from "react";

const AddCartContext = React.createContext()

const initialState = {
    drinks: [],
    user: null,
    payment: null,
}

function cartReducer(state = initialState, action) {
    switch (action.type) {
        case "ADD_CART": {
            return {
                ...state,
                drinks: action.drinks,
                user: action.user,
                payment: action.payment,
            }
        }
        case "DELETE_CART": {
            return {
                ...initial
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
        <AddCartContext.Provider value={{ state, dispatch }}>
            {children}
        </AddCartContext.Provider>
    )
}

export { AddCartProvider, AddCartContext };