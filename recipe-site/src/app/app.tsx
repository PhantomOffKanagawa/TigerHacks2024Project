import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecipeList from '../recipes/Recipes';
import RecipeDetail from '../recipes/RecipeDetail';
import Homepage from '../homepage/homepage';
import Login from '@/account/login';
import Register from '@/account/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;