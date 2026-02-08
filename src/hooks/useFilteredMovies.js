import { useState, useEffect } from 'react'
import { tmdbService } from '../services/tmdb'

/**
 * Custom hook for fetching filtered movies with pagination
 * @param {Object} filters - Filter options (genre, year, sortBy)
 * @param {number} page - Current page number
 * @returns {Object} { movies, loading, error, totalPages, hasMore }
 */
export const useFilteredMovies = (filters, page = 1) => {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [totalPages, setTotalPages] = useState(0)
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true)
            setError('')

            try {
                const data = await tmdbService.discoverMovies({ ...filters, page })

                setMovies(data.results || [])
                setTotalPages(data.total_pages || 0)
                setHasMore(page < (data.total_pages || 0))
            } catch (err) {
                console.error('Error fetching filtered movies:', err)
                setError('Failed to fetch movies. Please try again later.')
                setMovies([])
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
    }, [filters.genre, filters.year, filters.sortBy, page])

    return { movies, loading, error, totalPages, hasMore }
}
