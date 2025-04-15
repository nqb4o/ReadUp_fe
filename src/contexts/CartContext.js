import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // Tính số lượng từ yêu thích
    const favoritesCount = favorites.length;

    // Thêm từ vào wishlist
    const addToFavorites = (item) => {
        setFavorites((prev) => {
            if (!prev.some((fav) => fav.word === item.word)) {
                return [...prev, item];
            }
            return prev;
        });
    };

    // Xóa từ khỏi wishlist
    const removeFromFavorites = (word) => {
        setFavorites((prev) => prev.filter((item) => item.word !== word));
    };

    // Kiểm tra xem từ có trong wishlist không
    const isFavorite = (word) => {
        return favorites.some((item) => item.word === word);
    };

    // Giá trị context
    const value = {
        cartItems,
        setCartItems,
        cartItemCount: cartItems.length,
        favorites,
        favoritesCount,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};