import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FaStar, FaBookmark } from 'react-icons/fa';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session] = useState(supabase.auth.session());
  
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('books')
          .select('*, categories(name, slug)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error.message);
        alert('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookDetails();
  }, [id]);
  
  const addToBookshelf = async () => {
    if (!session) {
      alert('请先登录');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_books')
        .insert([{
          user_id: session.user.id,
          book_id: id,
          status: 'want_to_read'
        }]);
      
      if (error) throw error;
      alert('已添加到书架!');
    } catch (error) {
      if (error.code === '23505') { // 唯一约束冲突
        alert('这本书已经在你的书架中了');
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!book) return <div className="text-center py-10">Book not found</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <img 
          src={book.cover_image_url || 'https://via.placeholder.com/300x450?text=No+Cover'} 
          alt={book.title} 
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
        
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(book.rating) ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-gray-600">{book.rating}/5</span>
        </div>
        
        <div className="mb-4">
          <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
            <a href={`/categories/${book.categories.slug}`} className="hover:underline">
              {book.categories.name}
            </a>
          </span>
        </div>
        
        <button 
          onClick={addToBookshelf}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6 hover:bg-blue-700"
        >
          <FaBookmark /> 添加到书架
        </button>
        
        <div className="prose max-w-none">
          <h3>简介</h3>
          <p>{book.description}</p>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">ISBN</h4>
              <p>{book.isbn || 'N/A'}</p>
            </div>
            <div>
              <h4 className="font-semibold">出版日期</h4>
              <p>{book.publication_date ? new Date(book.publication_date).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}