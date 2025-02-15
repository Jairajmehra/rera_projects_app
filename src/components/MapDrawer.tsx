import React, { useState } from 'react';
import ResidentialPropertyCard from './ResidentialPropertyCard';
import { ResidentialProject } from '@/services/residentialProjectService';

export type DrawerState = 'collapsed' | 'partial' | 'full';

interface MapDrawerProps {
    projects: ResidentialProject[];
    onProjectSelect: (project: ResidentialProject) => void;
    // filters will come here
}

const MapDrawer: React.FC<MapDrawerProps> = ({ projects, onProjectSelect }) => {

    const [drawerState, setDrawerState] = useState<DrawerState>('collapsed');

    const toggleDrawerState = () => {
        // Cycle through states: collapsed -> partial -> full -> collapsed...
        setDrawerState(prev => {
          if (prev === 'collapsed') return 'partial';
          if (prev === 'partial') return 'full';
          return 'collapsed';
        });
      };

    let drawerHeight: string;
    if (drawerState === 'collapsed') 
    { drawerHeight = '40px';} 
    else if (drawerState === 'partial') 
    { drawerHeight = '40%';} 
    else { drawerHeight = '90%';}

    return (
        <div 
        style={{ height: drawerHeight, transition: 'height 0.3s' }}
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg overflow-hidden z-20"
      >
        {/* Handle to toggle the drawer */}
        <div className="p-2 border-b cursor-pointer" onClick={toggleDrawerState}>
          <div className="w-12 h-1 bg-gray-400 rounded mx-auto"></div>
        </div>
        {drawerState !== 'collapsed' && 
        (
          <div className="p-4 overflow-auto h-full">
            {/* List of Project Cards */}
            <div className="space-y-4">
              {projects.map(project => (
                <ResidentialPropertyCard key={project.rera} project={project} onClick={() => onProjectSelect(project)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

export default MapDrawer;