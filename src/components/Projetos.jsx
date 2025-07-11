export default function Projetos() {
  return (
    <section className="py-20 px-10 bg-white" id="projetos">
      <h2 className="text-3xl font-bold mb-10">Projetos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border p-4 shadow rounded">Projeto 1</div>
        <div className="border p-4 shadow rounded">Projeto 2</div>
        <div className="border p-4 shadow rounded">Projeto 3</div>
      </div>
    </section>
  );
}