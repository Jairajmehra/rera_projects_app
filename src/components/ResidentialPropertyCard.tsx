import React from 'react';
import { ResidentialProject } from '@/services/residentialProjectService';
import exp from 'constants';


interface ResidentialPropertyCardProps {
    project: ResidentialProject;
    onClick: () => void;
}

const ResidentialPropertyCard: React.FC<ResidentialPropertyCardProps> = ({ project, onClick }) => {
    return (
        <div onClick={onClick} className="flex gap-4 p-4 shadow rounded cursor-pointer hover:shadow-md transition">
        <img src={project.coverPhotoLink} alt={project.name} className="w-24 h-24 object-cover rounded" />
        <div className="flex flex-col justify-between">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-gray-600">{project.localityNames}</p>
          <div className="text-md font-bold">₹{project.price?.value}</div>
          <div className="text-sm text-gray-600">{project.projectType}</div>
        </div>
      </div>
        
    )
}

export default ResidentialPropertyCard;