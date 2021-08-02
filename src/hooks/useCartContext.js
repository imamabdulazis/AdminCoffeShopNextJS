import React, { useEffect } from 'react'
import { AddCartContext } from "../context/addCartContext";

function useAddCart() {
    const context = React.useContext(AddCartContext);

    if (context === undefined) {
        throw new Error('use Add cart error')
    }
    return context;
}

export { useAddCart }