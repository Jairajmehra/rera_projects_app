import { useState, useEffect } from 'react';

const useViewport = (breakpoint: number = 768) => {

    const [isMobile, setIsMobile] = useState<boolean>(true);

    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        checkSize();

        window.addEventListener('resize', checkSize);
        
        return () => window.removeEventListener('resize', checkSize);
    }, [breakpoint]);

    return isMobile;
}

export default useViewport;