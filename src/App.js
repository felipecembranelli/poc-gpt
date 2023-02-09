import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatgpt from './pages/Chatgpt';
import StoryTelling from './pages/StoryTelling';
import './pages/home.css'
import './pages/chatgpt.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Chatgpt />} />
          <Route path="/story" element={<StoryTelling />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
