import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import RecipeList from '../recipes/Recipes'
import RecipeDetail from '../recipes/RecipeDetail'
import Homepage from '../homepage/homepage'
import Login from '@/account/login'
import RequireAuth from 'components/custom/RequireAuth'
import RequireUnAuth from 'components/custom/RequireUnAuth'
import About from '@/homepage/about'
import BrowseRecipes from '@/browse/BrowseRecipes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/about' element={<About />} />
        <Route
          path='/login'
          element={
            <RequireUnAuth>
              <Login />
            </RequireUnAuth>
          }
        />
        <Route
          path='/signup'
          element={
            <RequireUnAuth>
              <Login isSignUp={true} />
            </RequireUnAuth>
          }
        />
        <Route
          path='/browse'
          element={
            <RequireAuth>
              <BrowseRecipes />
            </RequireAuth>
          }
        />
        <Route
          path='/recipes'
          element={
            <RequireAuth>
              <RecipeList />
            </RequireAuth>
          }
        />
        <Route
          path='/recipes/:id'
          element={
            <RequireAuth>
              <RecipeDetail />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
