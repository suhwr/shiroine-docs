import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CategoryDetail } from './pages/CategoryDetail';
import { CommandDetail } from './pages/CommandDetail';

export default function App() {
  const [favorites, setFavorites] = useState<Array<{ name: string; category: string }>>(() => {
    try {
      const data = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (data.length > 0 && typeof data[0] === 'string') {
        localStorage.removeItem('favorites');
        return [];
      }
      return data;
    } catch { return []; }
  });

  const [recents, setRecents] = useState<Array<{ name: string; category: string }>>(() => {
    return JSON.parse(localStorage.getItem('recents') || '[]');
  });

  const toggleFavorite = (cmdName: string, category: string) => {
    setFavorites(prev => {
      const exists = prev.find(n => n.name === cmdName);
      let updated;
      if (exists) {
        updated = prev.filter(n => n.name !== cmdName);
      } else {
        updated = [...prev, { name: cmdName, category }];
      }
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
