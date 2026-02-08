// API Configuration
export const API_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
    IMAGE_SIZES: {
        poster: 'w500',
        backdrop: 'w1280',
        thumbnail: 'w200',
    },
}

// API Key
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

// API Options
const API_OPTIONS = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
}

/**
 * TMDB Service - Handles all API calls to The Movie Database
 */
export const tmdbService = {
    /**
     * Search for movies by query
     * @param {string} query - Search query
     * @returns {Promise<Array>} Array of movie objects
     */
    searchMovies: async (query) => {
        const endpoint = `${API_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        const response = await fetch(endpoint, API_OPTIONS)

        if (!response.ok) {
            throw new Error('Failed to search movies')
        }

        const data = await response.json()
        return data.results || []
    },

    /**
     * Get popular movies
     * @returns {Promise<Array>} Array of popular movie objects
     */
    getPopularMovies: async () => {
        const endpoint = `${API_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`
        const response = await fetch(endpoint, API_OPTIONS)

        if (!response.ok) {
            throw new Error('Failed to fetch popular movies')
        }

        const data = await response.json()
        return data.results || []
    },

    /**
     * Search for movies with pagination
     * @param {string} query - Search query
     * @param {number} page - Page number
     * @returns {Promise<Object>} Object with results and pagination info
     */
    searchMoviesWithPagination: async (query, page = 1) => {
        const endpoint = `${API_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        const response = await fetch(endpoint, API_OPTIONS)

        if (!response.ok) {
            throw new Error('Failed to search movies')
        }

        return await response.json()
    },

    /**
     * Get popular movies with pagination
     * @param {number} page - Page number
     * @returns {Promise<Object>} Object with results and pagination info
     */
    getPopularMoviesWithPagination: async (page = 1) => {
        const endpoint = `${API_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`
        const response = await fetch(endpoint, API_OPTIONS)

        if (!response.ok) {
            throw new Error('Failed to fetch popular movies')
        }

        return await response.json()
    },

    /**
     * Get all movie genres
     * @returns {Promise<Array>} Array of genre objects
     */
    getGenres: async () => {
        const endpoint = `${API_CONFIG.BASE_URL}/genre/movie/list`
        const response = await fetch(endpoint, API_OPTIONS)

        if (!response.ok) {
            throw new Error('Failed to fetch genres')
        }

        const data = await response.json()
        return data.genres || []
    },

    /**
     * Get movie details by ID
     * @param {number} movieId - Movie ID
     * @returns {Promise<Object>} Movie details object
     */
    getMovieDetails: async (movieId) => {
        const endpoint = `${API_CONFIG.BASE_URL}/movie/${movieId}`
        const response = await fetch(endpoint, API_OPTIONS)

        if (!response.ok) {
            throw new Error('Failed to fetch movie details')
        }

        return await response.json()
    },

    /**
     * Discover movies with filters
     * @param {Object} filters - Filter options (genre, year, sortBy, page)
     * @returns {Promise<Object>} Object with results and pagination info
     */
    discoverMovies: async (filters = {}) => {
        const { genre, year, sortBy = 'popularity.desc', page = 1 } = filters

        let endpoint = `${API_CONFIG.BASE_URL}/discover/movie?sort_by=${sortBy}&page=${page}`

        if (genre) {
            endpoint += `&with_genres=${genre}`
        }

        if (year) {
            endpoint += `&primary_release_year=${year}`
        }

        const response = await fetch(endpoint, API_OPTIONS)

        if (!response.ok) {
            throw new Error('Failed to discover movies')
        }

        return await response.json()
    },

    /**
     * Get full image URL
     * @param {string} path - Image path from API
     * @param {string} size - Image size (poster, backdrop, thumbnail)
     * @returns {string} Full image URL
     */
    getImageUrl: (path, size = 'poster') => {
        if (!path) return '/no-movie.png'
        return `${API_CONFIG.IMAGE_BASE_URL}${API_CONFIG.IMAGE_SIZES[size]}${path}`
    },
}
