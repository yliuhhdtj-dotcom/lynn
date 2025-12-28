
import React from 'react';

interface InfoCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-1">
        {icon && <div className="text-gray-400">{icon}</div>}
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-gray-900 font-medium text-lg leading-tight">{value || 'N/A'}</p>
    </div>
  );
};

export default InfoCard;
