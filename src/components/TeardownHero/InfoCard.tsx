interface InfoCardProps {
  partName: string;
  onClose: () => void;
}

const PART_DESCRIPTIONS: Record<string, string> = {
  'gear': 'High-precision helical gear with optimized tooth profile for smooth power transmission. Material: Case-hardened alloy steel.',
  'shaft': 'Precision-ground drive shaft with splined ends. Balanced for high-speed operation up to 6000 RPM.',
  'housing': 'Die-cast aluminum housing with integrated cooling fins. Provides structural support and heat dissipation.',
  'bearing': 'Double-row angular contact ball bearing. Designed for high radial and axial loads.',
  'default': 'Precision-engineered component of the gearbox assembly. Click for detailed specifications and documentation.'
};

export default function InfoCard({ partName, onClose }: InfoCardProps) {
  const description = PART_DESCRIPTIONS[partName.toLowerCase()] || PART_DESCRIPTIONS.default;

  return (
    <div className="w-64 rounded-xl shadow-xl p-4 bg-white/90 backdrop-blur transform transition-all">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-bold text-gray-900">{partName}</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <p className="text-sm text-gray-700 mb-4">
        {description}
      </p>
      
      <div className="space-y-2">
        <button 
          className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          onClick={() => window.open('#', '_blank')}
        >
          View Datasheet
        </button>
        
        <button 
          className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          onClick={() => window.open('#', '_blank')}
        >
          3D Model (STEP)
        </button>
      </div>
    </div>
  );
} 