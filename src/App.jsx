import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import CategoryPage from './pages/CategoryPage';
import Bookshelf from './pages/Bookshelf';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Navbar session={session} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/bookshelf" element={<Bookshelf />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;