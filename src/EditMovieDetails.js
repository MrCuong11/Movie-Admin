import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditMovieDetails({ movieDetails, setMovieDetails }) {
    const [categoriesList, setCategoriesList] = useState([]);
    const [countriesList, setCountriesList] = useState([]);

    // Fetch categories and countries
    useEffect(() => {
        axios.get('http://localhost:8080/categories')
            .then(response => setCategoriesList(response.data))
            .catch(error => console.error('Error fetching categories:', error));

        axios.get('http://localhost:8080/country')
            .then(response => setCountriesList(response.data))
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleCategoryChange = (categoryId) => {
        const isSelected = movieDetails.categories.some(c => c.id === categoryId);
        if (isSelected) {
            // Remove category
            const updatedCategories = movieDetails.categories.filter(c => c.id !== categoryId);
            setMovieDetails({ ...movieDetails, categories: updatedCategories });
        } else {
            // Add category
            const selectedCategory = categoriesList.find(cat => cat.id === categoryId);
            const updatedCategories = [...movieDetails.categories, selectedCategory];
            setMovieDetails({ ...movieDetails, categories: updatedCategories });
        }
    };

    const handleCountryChange = (countryId) => {
        const isSelected = movieDetails.countries.some(c => c.id === countryId);
        if (isSelected) {
            // Remove country
            const updatedCountries = movieDetails.countries.filter(c => c.id !== countryId);
            setMovieDetails({ ...movieDetails, countries: updatedCountries });
        } else {
            // Add country
            const selectedCountry = countriesList.find(country => country.id === countryId);
            const updatedCountries = [...movieDetails.countries, selectedCountry];
            setMovieDetails({ ...movieDetails, countries: updatedCountries });
        }
    };

    return (
        <div>
            <div className="mt-4">
                <label className="block font-semibold">Categories:</label>
                <div className="flex flex-wrap gap-2">
                    {categoriesList.map(category => (
                        <label key={category.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={movieDetails.categories.some(c => c.id === category.id)}
                                onChange={() => handleCategoryChange(category.id)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span>{category.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <label className="block font-semibold">Countries:</label>
                <div className="flex flex-wrap gap-2">
                    {countriesList.map(country => (
                        <label key={country.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={movieDetails.countries.some(c => c.id === country.id)}
                                onChange={() => handleCountryChange(country.id)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span>{country.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EditMovieDetails;
