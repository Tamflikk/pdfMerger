import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Merger from './pages/merger';
import Results from './pages/results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="merger" element={<Merger />} />
        <Route path="results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;