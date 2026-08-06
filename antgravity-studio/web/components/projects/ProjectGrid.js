import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects, onDelete }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-txt-secondary">Nenhum projeto encontrado.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} onDelete={onDelete} />
      ))}
    </div>
  );
}
