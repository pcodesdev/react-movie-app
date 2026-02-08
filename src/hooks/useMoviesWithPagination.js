import { useState, useEffect } from 'react'
import { tmdbService } from '../services/tmdb'
import { updateSearchCount } from '../appwrite'

/**
 * Custom hook for fetching movies with pagination
 * @param {string} searchTerm - Search term for movies
 * @param {number} page - Current page number
 * @returns {Object} { movies, loading, error, totalPages, hasMore }
 */
export const useMoviesWithPagination = (searchTerm, page = 1) => {
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
                let data
                if (searchTerm) {
                    data = await tmdbService.searchMoviesWithPagination(searchTerm, page)
                    // Update search count only for first result on page 1
                    if (page === 1 && data.results && data.results.length > 0) {
                        await updateSearchCount(searchTerm, data.results[0])
                    }
                } else {
                    data = await tmdbService.getPopularMoviesWithPagination(page)
                }

                setMovies(data.results || [])
                setTotalPages(data.total_pages || 0)
                setHasMore(page < (data.total_pages || 0))
            } catch (err) {
                console.error('Error fetching movies:', err)
                setError('Failed to fetch movies. Please try again later.')
                setMovies([])
            } finally {
                setLoading(false)
            }
        }

        fetchMovies()
    }, [searchTerm, page])

    return { movies, loading, error, totalPages, hasMore }
}
