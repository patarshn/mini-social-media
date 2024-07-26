import React, { useState } from 'react';
import StoryItem from './StoryItem';


const StoryPopup = ({ stories, username, onClose }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const storiesPerPage = 1;
    const totalPages = Math.ceil(stories.length / storiesPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * storiesPerPage;
    const currentStories = stories.slice(startIndex, startIndex + storiesPerPage);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                </form>
                <h3 className="font-bold text-lg">Hello!</h3>
                {currentStories.map((story) => (
                    <StoryItem
                        key={story._id}
                        imgProfile={story.img_profile}
                        username={story.username}
                        content={story.content}
                    />
                ))}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`${currentPage === 1 ? "bg-zinc-500" : "btnFav"} text-white px-4 py-2 rounded`}
                    >
                        Previous
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`${currentPage === totalPages ? "bg-zinc-500" : "btnFav"} text-white px-4 py-2 rounded`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryPopup;
