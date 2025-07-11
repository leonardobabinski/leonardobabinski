import Header from './components/Header';
import Hero from './components/Hero';
import Projetos from './components/Projetos';
import Sobre from './components/Sobre';
import Contato from './components/Contato';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans">
      <Header />
      <Hero />
      <Projetos />
      <Sobre />
      <Contato />
      <Footer />
    </div>
  );
}

export default App;