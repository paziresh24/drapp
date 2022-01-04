import { createContext, useContext, useMemo, useState } from 'react';

const FavoriteItemContext = createContext();

const useFavoriteItem = () => {
    const context = useContext(FavoriteItemContext);
    if (!context) {
        throw new Error(`useFavoriteItem must be used within a FavoriteItemContext`);
    }

    return context;
};

function FavoriteItemProvider(props) {
    const [favoriteItem, setFavoriteItem] = useState([]);
    const value = useMemo(() => [favoriteItem, setFavoriteItem], [favoriteItem]);
    return <FavoriteItemContext.Provider value={value} {...props} />;
}

export { useFavoriteItem, FavoriteItemProvider };
