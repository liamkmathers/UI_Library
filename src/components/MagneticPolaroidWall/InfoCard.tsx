interface Photo {
  src: string;
  caption: string;
}

interface InfoCardProps {
  photo: Photo;
  onClose: () => void;
}

export default function InfoCard({ photo, onClose }: InfoCardProps) {
  return (
    <div className="max-w-xs bg-white/95 shadow-2xl rounded-xl p-6 backdrop-blur-sm border border-gray-200">
      <img 
        src={photo.src} 
        alt={photo.caption}
        className="w-full rounded-lg shadow-md"
      />
      <p className="mt-4 text-sm text-gray-700 leading-relaxed">{photo.caption}</p>
      <button 
        onClick={onClose} 
        className="mt-4 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
      >
        Close
      </button>
    </div>
  );
} 