
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

const BookCard = ({ book, variant }) => {
    return (
        <Link to={`/book/${book.id}`} className="group relative block bg-transparent hover:translate-y-[-4px] transition-transform duration-300">
            <div className="aspect-[2/3] relative shadow-md group-hover:shadow-xl group-hover:shadow-violet-500/10 transition-shadow duration-300">
                <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                />

                {/* Badge */}
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-xs font-bold text-white flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {book.rating}
                </div>
            </div>

            <div className="pt-4">
                {variant === 'audio' ? (
                    <div className="space-y-2">
                        {book.narrator && (
                            <p className="text-zinc-400 text-sm">Narrated by <span className="text-white font-medium">{book.narrator}</span></p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Clock size={12} />
                            <span>{book.length}</span>
                        </div>
                        {book.shortDescription && (
                            <p className="text-zinc-500 text-sm italic leading-snug line-clamp-3">{book.shortDescription}</p>
                        )}
                    </div>
                ) : (
                    <>
                        <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">{book.title}</h3>
                        <p className="text-zinc-400 text-sm mb-3">{book.author}</p>

                        <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span className="bg-zinc-800 px-2 py-1 text-zinc-300">{book.genre.split('/')[0]}</span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {book.frequencyInterval === 1 ? 'Daily' : `${book.frequencyInterval} Days`}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
};

export default BookCard;
