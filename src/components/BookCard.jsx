import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        <div className="aspect-[2/3] overflow-hidden">
          <img 
            src={book.cover_image_url || 'https://via.placeholder.com/300x450?text=No+Cover'} 
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 mb-2">{book.author}</p>
          <div className="flex items-center">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={14} className={i < Math.round(book.rating) ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span className="text-sm text-gray-600">{book.rating}</span>
          </div>
          {book.categories && (
            <p className="text-xs text-gray-500 mt-2">{book.categories.name}</p>
          )}
        </div>
      </div>
    </Link>
  );
}