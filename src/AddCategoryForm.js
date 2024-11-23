import React, { useState } from 'react';

function AddCategoryForm() {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.name || !formData.slug) {
            setError('Please fill in all fields: Name and Slug.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Category added successfully!');
                setFormData({ name: '', slug: '' });
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message || 'Failed to add category.'}`);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to submit form. Please try again.');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Add New Category</h2>

            {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>}
            {successMessage && (
                <p className="text-green-600 bg-green-100 p-3 rounded mb-4">{successMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add Category
                </button>
            </form>
        </div>
    );
}

export default AddCategoryForm;
