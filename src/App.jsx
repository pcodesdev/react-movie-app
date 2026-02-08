import React, { useState } from 'react'
import { useDebounce } from 'react-use'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import MovieDetailsModal from './components/MovieDetailsModal'
import Pagination from './components/Pagination'
import FilterBar from './components/FilterBar'
import { useMoviesWithPagination } from './hooks/useMoviesWithPagination'
import { useFilteredMovies } from './hooks/useFilteredMovies'
import { useTrending } from './hooks/useTrending'
import { useMovieDetails } from './hooks/useMovieDetails'
import { useFavorites } from './hooks/useFavorites'
import Footer from './components/Footer'

const App = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [activeTab, setActiveTab] = useState('all') // 'all' or 'favorites'
    const [filters, setFilters] = useState({ genre: '', year: '', sortBy: 'popularity.desc' })

    // Debounce search term
    useDebounce(
        () => {
            setDebouncedSearchTerm(searchTerm)
            setCurrentPage(1) // Reset to page 1 on new search
        },
        500,
        [searchTerm]
    )

    // Use custom hooks - choose between search/popular or filtered
    const searchResults = useMoviesWithPagination(
        debouncedSearchTerm,
        currentPage
    )

    const filteredResults = useFilteredMovies(
        filters,
        currentPage
    )

    // Determine which results to use
    const isSearching = !!debouncedSearchTerm
    const { movies, loading, error, totalPages, hasMore } = isSearching ? searchResults : filteredResults

    const { trendingMovies } = useTrending()
    const { movieDetails, loading: detailsLoading, fetchDetails, clearDetails } = useMovieDetails()
    const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

    const handleMovieClick = async (movie) => {
        await fetchDetails(movie.id)
    }

    const handleFavoriteToggle = (movie) => {
        if (isFavorite(movie.id)) {
            removeFavorite(movie.id)
        } else {
            addFavorite(movie)
        }
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    // Display movies based on active tab
    const displayMovies = activeTab === 'favorites' ? favorites : movies

    return (
        <main className="min-h-screen flex flex-col relative">
            <div className="pattern" />

            <div className="wrapper flex-grow w-full">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id} className="">
                                    <p>{index + 1}</p>
                                    <img src={movie.poster_url} alt={movie.searchTerm} className="" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Tab Navigation */}
                <div className="tab-nav">
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Movies
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                        onClick={() => setActiveTab('favorites')}
                    >
                        Favorites ({favorites.length})
                    </button>
                </div>

                {/* Filter Bar - Only show for "All Movies" tab */}
                {activeTab === 'all' && !searchTerm && (
                    <FilterBar onFilterChange={handleFilterChange} />
                )}

                <section className='all-movies'>
                    <h2 className=''>{activeTab === 'favorites' ? 'Your Favorites' : 'All Movies'}</h2>

                    {activeTab === 'favorites' && favorites.length === 0 ? (
                        <div className="empty-state">
                            <h3>No Favorites Yet</h3>
                            <p>Start adding movies to your favorites by clicking the heart icon!</p>
                        </div>
                    ) : loading ? (
                        <p className='text-white'><Spinner /></p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <>
                            <ul>
                                {displayMovies.length > 0 ? (
                                    displayMovies.map((movie) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onClick={handleMovieClick}
                                            isFavorite={isFavorite(movie.id)}
                                            onFavoriteToggle={handleFavoriteToggle}
                                        />
                                    ))
                                ) : (
                                    <p className="text-white">No movies found.</p>
                                )}
                            </ul>

                            {/* Pagination - Only show for "All Movies" tab */}
                            {activeTab === 'all' && totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    hasMore={hasMore}
                                />
                            )}
                        </>
                    )}
                </section>
            </div>

            {/* Movie Details Modal */}
            {movieDetails && !detailsLoading && (
                <MovieDetailsModal
                    movie={movieDetails}
                    onClose={clearDetails}
                />
            )}

            <Footer />
        </main>
    )
}

export default App