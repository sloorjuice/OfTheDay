import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Music from './pages/Music'
import Games from './pages/Games'
import Movies from './pages/Movies'
import TV from './pages/Tv'
import Books from './pages/Books'
import Pokemon from './pages/Pokemon'
import './css/App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/games" element={<Games />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/books" element={<Books />} />
          <Route path="/pokemon" element={<Pokemon />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
