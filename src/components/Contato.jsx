import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Contato() {
  return (
    <section className="py-20 px-10 bg-white" id="contato">
      <h2 className="text-3xl font-bold mb-6">Contato</h2>
      <div className="flex gap-6 text-2xl">
        <a href="https://linkedin.com/in/leonardobabinski" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        <a href="https://github.com/leonardobabinski" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a href="mailto:seu@email.com"><FaEnvelope /></a>
      </div>
    </section>
  );
}