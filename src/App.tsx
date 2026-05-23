import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CategoryDetail } from './pages/CategoryDetail';
import { CommandDetail } from './pages/CommandDetail';

export default function App() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  });

  const [recents, setRecents] = useState<Array<{ name: string; category: string }>>(() => {
    return JSON.parse(localStorage.getItem('recents') || '[]');
  });

  const toggleFavorite = (cmdName: string) => {
    setFavorites(prev => {
      const updated = prev.includes(cmdName)
        ? prev.filter(n => n !== cmdName)
        : [...prev, cmdName];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const addRecent = (name: string, category: string) => {
    setRecents(prev => {
      const filtered = prev.filter(r => r.name !== name);
      const updated = [{ name, category }, ...filtered].slice(0, 5);
      localStorage.setItem('recents', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home favorites={favorites} recents={recents} />} />
          <Route path="/category/:catId" element={<CategoryDetail />} />
          <Route
            path="/command/:catId/:cmdName"
            element={
              <CommandDetail
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addRecent={addRecent}
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
