import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from '../recipes/recipes';
import Homepage from '../homepage/homepage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;