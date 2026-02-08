import { useState, useEffect } from 'react'
import { tmdbService } from '../services/tmdb'
import { updateSearchCount } from '../appwrite'

/**
 * Custom hook for fetching movies
 * @param {string} searchTerm - Search term for movies
 * @returns {Object} { movies, loading, error }
 */
export const useMovies = (searchTerm) => {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true)
            setError('')

            try {
                let results
                if (searchTerm) {
                    results = await tmdbService.searchMovies(searchTerm)
                    // Update search count in Appwrite
                    if (results && results.length > 0) {
                        await updateSearchCount(searchTerm, results[0])
                    }
                } else {
                    results = await tmdbService.getPopularMovies()
                }
                setMovies(results)
            } catch (err) {
                console.error('Error fetching movies:', err)
                setError('Failed to fetch movies. Please try again later.')
                setMovies([])
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
    }, [searchTerm])

    return { movies, loading, error }
}
