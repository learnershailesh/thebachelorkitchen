import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        setSubmitting(true);
        try {
            await onSubmit({ rating, comment });
            setRating(0);
            setComment('');
            onClose();
        } catch (error) {
            alert('Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border border-gray-100">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <MessageSquare size={20} className="text-[var(--primary)]" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-800">Share Feedback</h3>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:rotate-90">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="text-center mb-8">
                        <p className="text-gray-500 mb-6 font-medium">How would you rate our overall service?</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="focus:outline-none transition-transform hover:scale-125 duration-200"
                                >
                                    <Star
                                        size={40}
                                        className={`${star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <div className="mt-4 text-sm font-bold text-[var(--primary)] animate-bounce">
                                {rating === 5 ? 'Excellent! 😍' : rating === 4 ? 'Good! 😊' : rating === 3 ? 'Average! 😐' : 'Can be better! 😕'}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Comments</label>
                        <textarea
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-[var(--primary)] focus:bg-white transition-all min-h-[120px] text-gray-700 font-medium resize-none shadow-inner"
                            placeholder="Tell us what you loved or how we can improve..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 transition-colors"
                        >
                            Later
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-[2] py-4 bg-[var(--primary)] text-white font-black rounded-2xl shadow-lg shadow-green-200 transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Sending...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
