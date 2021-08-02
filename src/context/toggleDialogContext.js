import React, { useReducer, createContext } from 'react'

const ToggleDialogContext = createContext();

const initialState = {
    isOpen: false,
}

function toggleReducer(state = initialState, action) {
    switch (action.type) {
        case "OPEN": {
            return { isOpen: true }
        }
        case "CLOSE": {
            return { isOpen: false }
        }
        default:
            state;
    }
}

const ToggleDialogProvider = ({ children }) => {
    const { stateDialog, dispatchDialog } = useReducer(toggleReducer, initialState);

    const value = { stateDialog, dispatchDialog };

    return (
        <ToggleDialogContext.Provider value={value}>
            {children}
        </ToggleDialogContext.Provider>
    )
}
export { ToggleDialogContext, ToggleDialogProvider }