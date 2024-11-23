import React, { useState, useEffect } from 'react';

function MovieForm() {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        origin_name: '',
        poster_url: '',
        thumb_url: '',
        year: 0,
        type: '',
        content: '',
        status: '',
        time: '',
        episode_current: '',
        episode_total: '',
        view: 0,
        actor: [''],
        director: [''],
        categoryIds: [],
        countryIds: [],
        episodes: [{ name: '', slug: '', filename: '', link_embed: '', link_m3u8: '' }],
    });

    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch categories và countries từ backend
    useEffect(() => {
        fetch('http://localhost:8080/categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error('Error fetching categories:', err));

        fetch('http://localhost:8080/country')
            .then((res) => res.json())
            .then((data) => setCountries(data))
            .catch((err) => console.error('Error fetching countries:', err));
    }, []);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'year' || name === 'view' ? Number(value) : value });
    };

    // Xử lý mảng động
    const handleArrayChange = (index, field, value, fieldType) => {
        const updatedArray = [...formData[fieldType]];
        if (fieldType === 'episodes') {
            updatedArray[index][field] = value;
        } else {
            updatedArray[index] = value;
        }
        setFormData({ ...formData, [fieldType]: updatedArray });
    };

    const addField = (fieldType) => {
        const newField =
            fieldType === 'episodes'
                ? { name: '', slug: '', filename: '', link_embed: '', link_m3u8: '' }
                : '';
        setFormData({ ...formData, [fieldType]: [...formData[fieldType], newField] });
    };

    const removeField = (fieldType, index) => {
        const updatedArray = formData[fieldType].filter((_, i) => i !== index);
        setFormData({ ...formData, [fieldType]: updatedArray });
    };

    // Xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.name || !formData.slug || !formData.type) {
            setError('Please fill all required fields: Name, Slug, and Type.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/danh-sach/phim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([formData]),
            });

            if (response.ok) {
                setSuccessMessage('Movie added successfully!');
                setFormData({
                    name: '',
                    slug: '',
                    origin_name: '',
                    poster_url: '',
                    thumb_url: '',
                    year: 0,
                    type: '',
                    content: '',
                    status: '',
                    time: '',
                    episode_current: '',
                    episode_total: '',
                    view: 0,
                    actor: [''],
                    director: [''],
                    categoryIds: [],
                    countryIds: [],
                    episodes: [{ name: '', slug: '', filename: '', link_embed: '', link_m3u8: '' }],
                });
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message || 'Failed to add movie.'}`);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to submit form. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Add New Movie</h2>

            {/* Thông báo lỗi */}
            {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>}

            {/* Thông báo thành công */}
            {successMessage && (
                <p className="text-green-600 bg-green-100 p-3 rounded mb-4">{successMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                {['name', 'slug', 'origin_name', 'poster_url', 'thumb_url', 'type', 'content', 'status', 'time'].map(
                    (field) => (
                        <div key={field}>
                            <label className="block text-gray-700 font-medium mb-2 capitalize">
                                {field.replace('_', ' ')}
                            </label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                                required={['name', 'slug', 'type'].includes(field)}
                            />
                        </div>
                    )
                )}

                {/* Year */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Year</label>
                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* View */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">View</label>
                    <input
                        type="number"
                        name="view"
                        value={formData.view}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Actor */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Actors</label>
                    {formData.actor.map((actor, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={actor}
                                onChange={(e) => handleArrayChange(index, '', e.target.value, 'actor')}
                                className="w-full p-3 border border-gray-300 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeField('actor', index)}
                                className="ml-2 text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addField('actor')}
                        className="mt-2 text-blue-500"
                    >
                        + Add Actor
                    </button>
                </div>

                {/* Director */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Directors</label>
                    {formData.director.map((director, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={director}
                                onChange={(e) => handleArrayChange(index, '', e.target.value, 'director')}
                                className="w-full p-3 border border-gray-300 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => removeField('director', index)}
                                className="ml-2 text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addField('director')}
                        className="mt-2 text-blue-500"
                    >
                        + Add Director
                    </button>
                </div>



                {/* Categories Dropdown */}
                <div className="mb-4">
                    <label className="block text-gray-700">Categories</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) =>
                            setFormData({ ...formData, categoryIds: [...formData.categoryIds, e.target.value] })
                        }
                    >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <ul className="mt-2">
                        {formData.categoryIds.map((id, index) => (
                            <li key={index} className="flex items-center">
                                <span>{categories.find((cat) => cat.id === parseInt(id))?.name || id}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            categoryIds: formData.categoryIds.filter((_, i) => i !== index),
                                        })
                                    }
                                    className="ml-2 text-red-500"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Countries Dropdown */}
                <div className="mb-4">
                    <label className="block text-gray-700">Countries</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) =>
                            setFormData({ ...formData, countryIds: [...formData.countryIds, e.target.value] })
                        }
                    >
                        <option value="">Select a Country</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                    <ul className="mt-2">
                        {formData.countryIds.map((id, index) => (
                            <li key={index} className="flex items-center">
                                <span>{countries.find((c) => c.id === parseInt(id))?.name || id}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            countryIds: formData.countryIds.filter((_, i) => i !== index),
                                        })
                                    }
                                    className="ml-2 text-red-500"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Episodes */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Episodes</label>
                    {formData.episodes.map((episode, index) => (
                        <div key={index} className="p-4 border rounded mb-4 bg-white shadow-md">
                            {['name', 'slug', 'filename', 'link_embed', 'link_m3u8'].map((field) => (
                                <div key={field} className="mb-2">
                                    <label className="block text-gray-700 font-medium mb-1 capitalize">{field}</label>
                                    <input
                                        type="text"
                                        value={episode[field]}
                                        onChange={(e) =>
                                            handleArrayChange(index, field, e.target.value, 'episodes')
                                        }
                                        className="w-full p-3 border border-gray-300 rounded"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => removeField('episodes', index)}
                                className="text-red-500"
                            >
                                Remove Episode
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addField('episodes')}
                        className="mt-2 text-blue-500"
                    >
                        + Add Episode
                    </button>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default MovieForm;
