import { useState } from 'react'
import { tmdbService } from '../services/tmdb'

/**
 * Custom hook for fetching movie details
 * @param {number} movieId - Movie ID
 * @returns {Object} { movieDetails, loading, error, fetchDetails }
 */
export const useMovieDetails = () => {
    const [movieDetails, setMovieDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchDetails = async (movieId) => {
        if (!movieId) return

        setLoading(true)
        setError('')

        try {
            const details = await tmdbService.getMovieDetails(movieId)
            setMovieDetails(details)
        } catch (err) {
            console.error('Error fetching movie details:', err)
            setError('Failed to load movie details')
        } finally {
            setLoading(false)
        }
    }

    const clearDetails = () => {
        setMovieDetails(null)
        setError('')
    }

    return { movieDetails, loading, error, fetchDetails, clearDetails }
}
