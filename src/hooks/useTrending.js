import { useState, useEffect } from 'react'
import { getTrendingMovies } from '../appwrite'

/**
 * Custom hook for fetching trending movies
 * @returns {Object} { trendingMovies, loading, error }
 */
export const useTrending = () => {
    const [trendingMovies, setTrendingMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadTrending = async () => {
            try {
                const trending = await getTrendingMovies()
                setTrendingMovies(trending)
            } catch (err) {
                console.error('Error loading trending movies:', err)
                setError('Failed to load trending movies')
            } finally {
                setLoading(false)
            }
        }

        loadTrending()
    }, [])

    return { trendingMovies, loading, error }
}
