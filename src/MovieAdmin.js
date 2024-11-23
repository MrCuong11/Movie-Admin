import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import EditMovieDetails from './EditMovieDetails';

ReactModal.setAppElement('#root');

function MovieAdmin() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [movieDetails, setMovieDetails] = useState({
        name: '',
        poster_url: '',
        thumb_url: '',
        slug: '',
        origin_name: '',
        year: '',
        type: '',
        status: '',
        time: '',
        episode_current: '',
        episode_total: '',
        view: '',
        content: '',
        actor: [],
        director: [],
        categories: [],
        countries: [],
        episodes: []
    });



    // Fetch movies
    useEffect(() => {
        axios.get(`http://localhost:8080/danh-sach/phim-moi-cap-nhat?page=${currentPage}`)
            .then(response => {
                if (response.data.status) {
                    setMovies(response.data.items);
                    setTotalPages(response.data.pagination.totalPages);
                }
            })
            .catch(error => console.error('Error fetching movies:', error));
    }, [currentPage]);

    const fetchMovieDetails = (slug) => {
        axios.get(`http://localhost:8080/danh-sach/phim/${slug}`)
            .then(response => {
                const data = response.data;

                // Loại bỏ tập phim trùng lặp dựa trên slug
                const uniqueEpisodes = Array.from(
                    new Map(data.episodes.map(episode => [episode.slug || episode.id, episode])).values()
                );

                setMovieDetails({
                    ...data,
                    episodes: uniqueEpisodes
                });
                setIsModalOpen(true);
            })
            .catch(error => console.error('Error fetching movie details:', error));
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setMovieDetails({
            name: '',
            poster_url: '',
            thumb_url: '',
            slug: '',
            origin_name: '',
            year: '',
            type: '',
            status: '',
            time: '',
            episode_current: '',
            episode_total: '',
            view: '',
            content: '',
            actor: [],
            director: [],
            categories: [],
            countries: [],
            episodes: [],
            comments: [],
            favorites: [],
            modified: { time: '' }
        });
    };


    const handleDeleteMovie = (movieId) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            axios.delete(`http://localhost:8080/danh-sach/phim/${movieId}`)
                .then(() => {
                    alert('Movie deleted successfully');
                    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
                })
                .catch(error => console.error('Error deleting movie:', error));
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Movie List</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Thumbnail</th>
                            <th className="border border-gray-300 px-4 py-2">Poster</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Slug</th>
                            <th className="border border-gray-300 px-4 py-2">Origin Name</th>
                            <th className="border border-gray-300 px-4 py-2">Year</th>
                            <th className="border border-gray-300 px-4 py-2">Views</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(movie => (
                            <tr key={movie.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">
                                    <img src={movie.thumb_url} alt={movie.name} className="w-24 h-24 object-cover" />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <img src={movie.poster_url} alt={movie.name} className="w-24 h-24 object-cover" />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{movie.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{movie.slug}</td>
                                <td className="border border-gray-300 px-4 py-2">{movie.origin_name}</td>
                                <td className="border border-gray-300 px-4 py-2">{movie.year}</td>
                                <td className="border border-gray-300 px-4 py-2">{movie.view}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        onClick={() => fetchMovieDetails(movie.slug)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMovie(movie.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span className="mx-4 text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>

            {/* Modal for viewing movie details */}
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                {movieDetails && (
                    <div className="relative bg-white max-h-full overflow-y-auto rounded shadow-lg p-6 w-full max-w-3xl">
                        {/* Nút Close */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-50"
                            aria-label="Close"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Nội dung sửa phim */}
                        <h2 className="text-xl font-bold mb-4">Edit Movie: {movieDetails.name}</h2>
                        <div className="space-y-4">
                            {/* Các trường cần chỉnh sửa */}
                            <div>
                                <label className="block font-semibold">Name:</label>
                                <input
                                    type="text"
                                    value={movieDetails.name}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Poster URL:</label>
                                <input
                                    type="text"
                                    value={movieDetails.poster_url}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, poster_url: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Thumbnail URL:</label>
                                <input
                                    type="text"
                                    value={movieDetails.thumb_url}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, thumb_url: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Slug:</label>
                                <input
                                    type="text"
                                    value={movieDetails.slug}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, slug: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Origin Name:</label>
                                <input
                                    type="text"
                                    value={movieDetails.origin_name}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, origin_name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Year:</label>
                                <input
                                    type="number"
                                    value={movieDetails.year}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, year: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Type:</label>
                                <input
                                    type="text"
                                    value={movieDetails.type}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, type: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Status:</label>
                                <input
                                    type="text"
                                    value={movieDetails.status}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, status: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Time:</label>
                                <input
                                    type="text"
                                    value={movieDetails.time}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, time: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Episode Current:</label>
                                <input
                                    type="number"
                                    value={movieDetails.episode_current}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, episode_current: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Episode Total:</label>
                                <input
                                    type="number"
                                    value={movieDetails.episode_total}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, episode_total: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Views:</label>
                                <input
                                    type="number"
                                    value={movieDetails.view}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, view: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Content:</label>
                                <textarea
                                    value={movieDetails.content}
                                    onChange={(e) => setMovieDetails({ ...movieDetails, content: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold">Actors:</label>
                            {movieDetails.actor.map((actor, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={actor}
                                        onChange={(e) => {
                                            const updatedActors = [...movieDetails.actor];
                                            updatedActors[index] = e.target.value;
                                            setMovieDetails({ ...movieDetails, actor: updatedActors });
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                    <button
                                        onClick={() => {
                                            const updatedActors = movieDetails.actor.filter((_, i) => i !== index);
                                            setMovieDetails({ ...movieDetails, actor: updatedActors });
                                        }}
                                        className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const updatedActors = [...movieDetails.actor, ''];
                                    setMovieDetails({ ...movieDetails, actor: updatedActors });
                                }}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add New Actor
                            </button>
                        </div>

                        <div className="mt-4">
                            <label className="block font-semibold">Directors:</label>
                            {movieDetails.director.map((director, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={director}
                                        onChange={(e) => {
                                            const updatedDirectors = [...movieDetails.director];
                                            updatedDirectors[index] = e.target.value;
                                            setMovieDetails({ ...movieDetails, director: updatedDirectors });
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                    <button
                                        onClick={() => {
                                            const updatedDirectors = movieDetails.director.filter((_, i) => i !== index);
                                            setMovieDetails({ ...movieDetails, director: updatedDirectors });
                                        }}
                                        className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const updatedDirectors = [...movieDetails.director, ''];
                                    setMovieDetails({ ...movieDetails, director: updatedDirectors });
                                }}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Add New Director
                            </button>
                        </div>

                        {/* Sử dụng EditMovieDetails */}
                        <EditMovieDetails
                            movieDetails={movieDetails}
                            setMovieDetails={setMovieDetails}
                        />


                        <h3 className="mt-4 font-bold">Comments:</h3>
                        {movieDetails.comments && movieDetails.comments.length > 0 ? (
                            <ul className="list-disc ml-6">
                                {movieDetails.comments.map((comment, index) => (
                                    <li key={index}>
                                        <strong>{comment.username}</strong> - {new Date(comment.createdAt).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No comments available.</p>
                        )}

                        <h3 className="mt-4 font-bold">Favorites:</h3>
                        {movieDetails.favorites && movieDetails.favorites.length > 0 ? (
                            <ul className="list-disc ml-6">
                                {movieDetails.favorites.map((favorite, index) => (
                                    <li key={index}>
                                        <strong>{favorite.username}</strong> - {new Date(favorite.createdAt).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No favorites available.</p>
                        )}

                        <p><strong>Modified:</strong> {movieDetails.modified?.time}</p>


                        {/* Nút Save */}
                        <button
                            onClick={() => {
                                // Loại bỏ các tập phim trùng lặp dựa trên id hoặc slug
                                const uniqueEpisodes = Array.from(
                                    new Map(
                                        movieDetails.episodes.map(episode => [episode.slug || episode.id, episode])
                                    ).values()
                                );

                                // Cập nhật lại movieDetails với danh sách tập không trùng lặp
                                const updatedDetails = { ...movieDetails, episodes: uniqueEpisodes };

                                // Gọi API để cập nhật
                                axios.put(`http://localhost:8080/danh-sach/phim/${movieDetails.id}`, updatedDetails)
                                    .then(() => {
                                        alert('Movie updated successfully!');
                                        closeModal();
                                    })
                                    .catch(error => console.error('Error updating movie:', error));
                            }}
                            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Save
                        </button>


                    </div>
                )}
            </ReactModal>

        </div>
    );
}

export default MovieAdmin;
