import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecipeList from '../recipes/recipes';
import RecipeDetail from '../recipes/RecipeDetail';
import Homepage from '../homepage/homepage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;