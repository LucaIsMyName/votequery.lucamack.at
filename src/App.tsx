import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VotingProvider } from './context/VotingContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Create from './pages/Create';
import Query from './pages/Query';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <VotingProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/query" element={<Query />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Layout>
      </VotingProvider>
    </Router>
  );
}

export default App;
