import VideoCard from './VideoCard';

export default function VideoGrid({ videos, onDelete, onPlay }) {
  if (videos.length === 0) {
    return <div className="text-center py-20"><p className="text-txt-secondary">Nenhum vídeo encontrado.</p></div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((v) => <VideoCard key={v.id} video={v} onDelete={onDelete} onPlay={onPlay} />)}
    </div>
  );
}
