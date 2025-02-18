import React, { useMemo, useState } from 'react';
import ResidentialPropertyCard from './ResidentialPropertyCard';
import { ResidentialProject } from '@/services/residentialProjectService';
import useViewport from './useViewport';
import { Filters } from '../app/map/page';

export type DrawerState = 'collapsed' | 'partial' | 'full';

interface MapDrawerProps {
    projects: ResidentialProject[];
    onProjectSelect: (project: ResidentialProject) => void;
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
}

const MapDrawer: React.FC<MapDrawerProps> = ({ projects, onProjectSelect, filters, onFiltersChange }) => {

    const [drawerState, setDrawerState] = useState<DrawerState>('collapsed');
    const isMobile = useViewport();

    const toggleDrawerState = () => {
        // Cycle through states: collapsed -> partial -> full -> collapsed...
        if (isMobile) {
            setDrawerState(prev => {
                if (prev === 'collapsed') return 'partial';
                if (prev === 'partial') return 'full';
                return 'collapsed';
            });
        }
    };

    // let drawerHeight: string;
    // if (drawerState === 'collapsed') 
    // { drawerHeight = '40px';} 
    // else if (drawerState === 'partial') 
    // { drawerHeight = '40%';} 
    // else { drawerHeight = '90%';}

      // Determine drawer dimensions based on viewport
      const drawerStyles = isMobile
      ? {
          height: drawerState === 'collapsed' ? '40px' 
                 : drawerState === 'partial' ? '40%' 
                 : '90%',
          transition: 'height 0.3s',
          width: '100%'
        }
      : {
          height: '100%',
          width: '400px',
          right: 0,
          top: 0
        };

         // Compute available options from the projects in the viewport.
  // (For a complete list you might want to use data from a separate source.)
  // const availableBHKs = ["BHK 1", "BHK 2", "BHK 3", "BHK 4"];
  // const availableProjectTypes = ["Residential", "Commercial"];
  // const availableLocations = ['Thaltej', 'Gota', 'Prahladnagar', 'Bopal', 'Satellite'];

    // return (
    //     <div 
    //     style={drawerStyles}
    //     className={`fixed bg-white shadow-lg overflow-hidden z-20
    //         ${isMobile ? 'bottom-0 left-0 right-0' : 'top-0'}`}
    //   >
    //     {/* Handle only shows on mobile */}
    //     {isMobile && (
    //         <div className="p-2 border-b cursor-pointer" onClick={toggleDrawerState}>
    //             <div className="w-12 h-1 bg-gray-400 rounded mx-auto"></div>
    //         </div>
    //     )}

    //    {(!isMobile || drawerState !== 'collapsed') && (
    //     <div className="p-4 overflow-auto h-full">
    //         <div className="space-y-4">
    //             {projects.map(project => (
    //                 <ResidentialPropertyCard 
    //                     key={project.rera} 
    //                     project={project} 
    //                     onClick={() => onProjectSelect(project)} 
    //                 />
    //             ))}
    //         </div>
    //       </div>
    //     )
    //     }

    //   </div>
    // );
    return (
        <div
          style={drawerStyles}
          className={`fixed bg-white shadow-lg overflow-hidden z-20 ${
            isMobile ? "bottom-0 left-0 right-0" : "top-0"
          }`}
        >
          {isMobile && (
            <div className="p-2 border-b cursor-pointer" onClick={toggleDrawerState}>
              <div className="w-12 h-1 bg-gray-400 rounded mx-auto"></div>
            </div>
          )}
    
          
    
          {/* Project list */}
          {(!isMobile || drawerState !== "collapsed") && (
            <div className="p-4 overflow-auto h-full">
              <div className="space-y-4">
                {projects.map((project) => (
                  <ResidentialPropertyCard
                    key={project.rera}
                    project={project}
                    onClick={() => onProjectSelect(project)}
                  />
                ))}
                {projects.length === 0 && <div>No projects match these filters.</div>}
              </div>
            </div>
          )}
        </div>
      );
};

export default MapDrawer;