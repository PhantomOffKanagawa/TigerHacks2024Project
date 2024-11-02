import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import RecipeList from '../recipes/Recipes';
import RecipeDetail from '../recipes/RecipeDetail';
import Homepage from '../homepage/homepage';
import Login from '@/account/login';
import RequireAuth from 'components/custom/RequireAuth';
import RequireUnAuth from 'components/custom/RequireUnAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <RequireUnAuth>
            <Login />
          </RequireUnAuth>
        } />
        <Route path="/signup" element={
          <RequireUnAuth>
            <Login isSignUp={true} />
          </RequireUnAuth>
        } />
        <Route path="/" element={<Homepage />} />
        <Route path="/recipes" element={
          <RequireAuth>
            <RecipeList />
          </RequireAuth>
        } />
        <Route path="/recipes/:id" element={
          <RequireAuth>
            <RecipeDetail />
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;