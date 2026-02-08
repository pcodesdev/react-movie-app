import React from 'react'
import PropTypes from 'prop-types'
import { tmdbService } from '../services/tmdb'
import FavoriteButton from './FavoriteButton'

const MovieCard = ({ movie, onClick, isFavorite, onFavoriteToggle }) => {
    return (
        <div
            className="movie-card cursor-pointer transition-transform hover:scale-105"
            onClick={() => onClick && onClick(movie)}
        >
            {/* Favorite Button */}
            {onFavoriteToggle && (
                <FavoriteButton
                    isFavorite={isFavorite}
                    onClick={() => onFavoriteToggle(movie)}
                />
            )}

            <img
                src={tmdbService.getImageUrl(movie.poster_path, 'poster')}
                alt={movie.title}
                loading="lazy"
            />
            <div className="mt-4">
                <h3>{movie.title}</h3>
            </div>
            <div className="content">
                <div className="rating">
                    <img src="./star.svg" alt="Star Icon" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="year">
                    <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                </div>
                <p className='lang'>{movie.original_language}</p>

            </div>
        </div>
    )
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        poster_path: PropTypes.string,
        vote_average: PropTypes.number.isRequired,
        release_date: PropTypes.string,
        original_language: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
    isFavorite: PropTypes.bool,
    onFavoriteToggle: PropTypes.func,
}

export default MovieCard

