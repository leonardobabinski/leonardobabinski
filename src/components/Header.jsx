export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 bg-white shadow-md fixed w-full z-50">
      <h1 className="text-xl font-bold">Leonardo Babinski</h1>
      <nav className="flex gap-6">
        <a href="#projetos" className="hover:text-blue-600">Projetos</a>
        <a href="#sobre" className="hover:text-blue-600">Sobre</a>
        <a href="#contato" className="hover:text-blue-600">Contato</a>
      </nav>
    </header>
  );
}