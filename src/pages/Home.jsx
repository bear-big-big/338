import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BookCard from '../components/BookCard';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // 获取精选图书
    const fetchFeaturedBooks = async () => {
      const { data } = await supabase
        .from('books')
        .select('*, categories(name)')
        .order('rating', { ascending: false })
        .limit(8);
      setFeaturedBooks(data || []);
    };
    
    // 获取分类
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*');
      setCategories(data || []);
    };
    
    fetchFeaturedBooks();
    fetchCategories();
  }, []);
  
  return (
    <div>
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-8">欢迎来到 BookNook</h1>
        <p className="text-xl mb-6">发现你的下一本好书</p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">浏览分类</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map(category => (
            <Link 
              key={category.id} 
              to={`/categories/${category.slug}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">热门图书</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}