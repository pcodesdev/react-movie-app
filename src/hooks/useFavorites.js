import { useState, useEffect } from 'react'

/**
 * Custom hook for managing favorites in localStorage
 * @returns {Object} { favorites, addFavorite, removeFavorite, isFavorite }
 */
export const useFavorites = () => {
    const [favorites, setFavorites] = useState([])

    // Load favorites from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('movieFavorites')
        if (stored) {
            try {
                setFavorites(JSON.parse(stored))
            } catch (error) {
                console.error('Error loading favorites:', error)
                setFavorites([])
            }
        }
    }, [])

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('movieFavorites', JSON.stringify(favorites))
    }, [favorites])

    const addFavorite = (movie) => {
        setFavorites((prev) => {
            // Avoid duplicates
            if (prev.some((fav) => fav.id === movie.id)) {
                return prev
            }
            return [...prev, movie]
        })
    }

    const removeFavorite = (movieId) => {
        setFavorites((prev) => prev.filter((movie) => movie.id !== movieId))
    }

    const isFavorite = (movieId) => {
        return favorites.some((movie) => movie.id === movieId)
    }

    return { favorites, addFavorite, removeFavorite, isFavorite }
}
