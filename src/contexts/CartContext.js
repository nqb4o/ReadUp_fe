import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToCart = (book) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === book.book_id);
            if (existing) {
                return prev.map(item =>
                    item.id === book.book_id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...book, quantity: 1 }];
        });
    };

    const removeFromCart = (bookId) => {
        setCartItems(prev => prev.filter(item => item.book_id !== bookId));
    };

    const toggleFavorite = (book) => {
        setFavorites(prev => {
            const exists = prev.some(item => item.book_id === book.book_id);
            if (exists) {
                return prev.filter(item => item.book_id !== book.book_id);
            }
            return [...prev, book];
        });
    };

    const updateQuantity = (bookId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative quantities
        setCartItems(prev =>
            prev.map(item =>
                item.book_id === bookId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const incrementQuantity = (bookId) => {
        setCartItems(prev =>
            prev.map(item =>
                item.book_id === bookId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decrementQuantity = (bookId) => {
        setCartItems(prev =>
            prev.map(item =>
                item.book_id === bookId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const favoritesCount = favorites.length;

    return (
        <CartContext.Provider value={{
            cartItems,
            favorites,
            cartItemCount,
            favoritesCount,
            addToCart,
            removeFromCart,
            toggleFavorite,
            updateQuantity,
            incrementQuantity,
            decrementQuantity,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}