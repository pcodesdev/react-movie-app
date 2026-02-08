import React from 'react'
import PropTypes from 'prop-types'

const FavoriteButton = ({ isFavorite, onClick }) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation() // Prevent card click
                onClick()
            }}
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <svg
                className="w-6 h-6"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    )
}

FavoriteButton.propTypes = {
    isFavorite: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default FavoriteButton
