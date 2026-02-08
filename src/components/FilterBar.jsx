import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { tmdbService } from '../services/tmdb'

const FilterBar = ({ onFilterChange }) => {
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState('')
    const [selectedYear, setSelectedYear] = useState('')
    const [sortBy, setSortBy] = useState('popularity.desc')

    // Load genres on mount
    useEffect(() => {
        const loadGenres = async () => {
            try {
                const genreList = await tmdbService.getGenres()
                setGenres(genreList)
            } catch (error) {
                console.error('Error loading genres:', error)
            }
        }
        loadGenres()
    }, [])

    // Generate year options (current year to 1900)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i)

    const handleFilterChange = () => {
        onFilterChange({
            genre: selectedGenre,
            year: selectedYear,
            sortBy,
        })
    }

    const handleReset = () => {
        setSelectedGenre('')
        setSelectedYear('')
        setSortBy('popularity.desc')
        onFilterChange({
            genre: '',
            year: '',
            sortBy: 'popularity.desc',
        })
    }

    return (
        <div className="filter-bar">
            <div className="filter-group">
                {/* Genre Filter */}
                <div className="filter-item">
                    <label htmlFor="genre-filter">Genre</label>
                    <select
                        id="genre-filter"
                        value={selectedGenre}
                        onChange={(e) => {
                            setSelectedGenre(e.target.value)
                            onFilterChange({ genre: e.target.value, year: selectedYear, sortBy })
                        }}
                    >
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Year Filter */}
                <div className="filter-item">
                    <label htmlFor="year-filter">Year</label>
                    <select
                        id="year-filter"
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value)
                            onFilterChange({ genre: selectedGenre, year: e.target.value, sortBy })
                        }}
                    >
                        <option value="">All Years</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div className="filter-item">
                    <label htmlFor="sort-filter">Sort By</label>
                    <select
                        id="sort-filter"
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value)
                            onFilterChange({ genre: selectedGenre, year: selectedYear, sortBy: e.target.value })
                        }}
                    >
                        <option value="popularity.desc">Most Popular</option>
                        <option value="popularity.asc">Least Popular</option>
                        <option value="vote_average.desc">Highest Rated</option>
                        <option value="vote_average.asc">Lowest Rated</option>
                        <option value="release_date.desc">Newest First</option>
                        <option value="release_date.asc">Oldest First</option>
                    </select>
                </div>

                {/* Reset Button */}
                <button onClick={handleReset} className="filter-reset-btn">
                    Reset Filters
                </button>
            </div>
        </div>
    )
}

FilterBar.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
}

export default FilterBar
