import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const MovieDetailsModal = ({ movie, onClose }) => {
    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [onClose])

    if (!movie) return null

    return (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-dark-100 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-light-100 transition-colors z-10"
                    aria-label="Close modal"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Movie Backdrop */}
                {movie.backdrop_path && (
                    <div className="relative h-64 sm:h-96 overflow-hidden rounded-t-2xl">
                        <img
                            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-100 to-transparent" />
                    </div>
                )}

                {/* Content */}
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <img
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-movie.png'}
                                alt={movie.title}
                                className="w-48 rounded-lg shadow-lg mx-auto sm:mx-0"
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>

                            {movie.tagline && (
                                <p className="text-light-200 italic mb-4">&quot;{movie.tagline}&quot;</p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <img src="./star.svg" alt="Rating" className="w-5 h-5" />
                                    <span className="text-white font-bold">{movie.vote_average?.toFixed(1)}</span>
                                    <span className="text-gray-100">({movie.vote_count} votes)</span>
                                </div>

                                {movie.release_date && (
                                    <div className="text-gray-100">
                                        📅 {new Date(movie.release_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                )}

                                {movie.runtime && (
                                    <div className="text-gray-100">
                                        ⏱️ {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                                    </div>
                                )}
                            </div>

                            {/* Genres */}
                            {movie.genres && movie.genres.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres.map((genre) => (
                                            <span
                                                key={genre.id}
                                                className="px-3 py-1 bg-light-100/10 text-light-100 rounded-full text-sm"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Overview */}
                            {movie.overview && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Overview</h3>
                                    <p className="text-gray-100 leading-relaxed">{movie.overview}</p>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {movie.status && (
                                    <div>
                                        <span className="text-light-200 font-semibold">Status:</span>
                                        <span className="text-gray-100 ml-2">{movie.status}</span>
                                    </div>
                                )}

                                {movie.original_language && (
                                    <div>
                                        <span className="text-light-200 font-semibold">Language:</span>
                                        <span className="text-gray-100 ml-2 uppercase">{movie.original_language}</span>
                                    </div>
                                )}

                                {movie.budget > 0 && (
                                    <div>
                                        <span className="text-light-200 font-semibold">Budget:</span>
                                        <span className="text-gray-100 ml-2">
                                            ${movie.budget.toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                {movie.revenue > 0 && (
                                    <div>
                                        <span className="text-light-200 font-semibold">Revenue:</span>
                                        <span className="text-gray-100 ml-2">
                                            ${movie.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

MovieDetailsModal.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        tagline: PropTypes.string,
        overview: PropTypes.string,
        poster_path: PropTypes.string,
        backdrop_path: PropTypes.string,
        vote_average: PropTypes.number,
        vote_count: PropTypes.number,
        release_date: PropTypes.string,
        runtime: PropTypes.number,
        status: PropTypes.string,
        original_language: PropTypes.string,
        budget: PropTypes.number,
        revenue: PropTypes.number,
        genres: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
            })
        ),
    }),
    onClose: PropTypes.func.isRequired,
}

export default MovieDetailsModal
