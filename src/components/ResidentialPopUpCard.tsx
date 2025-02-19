import React, { useEffect, useState } from 'react';
import { ResidentialProperty } from '../services/residentialPropertyService';

interface ResidentialPopUpCardProps {
    property: ResidentialProperty;
    onClose: () => void;
}

const ResidentialPopUpCard: React.FC<ResidentialPopUpCardProps> = ({property, onClose}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 480px)');
        setIsMobile(mediaQuery.matches);
        
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return (
        <div style={{
            position: "absolute",
            bottom: "80px",
            left: isMobile ? "12px" : "16px",
            right: isMobile ? "12px" : "16px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            width: "auto",
            maxWidth: "400px",
            margin: "0 auto",
            overflow: "hidden",
            marginBottom: "env(safe-area-inset-bottom, 16px)",
            minWidth: "280px",
        }}>
            {/* Image Container */}
            <div style={{
                width: "100%",
                height: "160px",
                background: "#f0f0f0", // Placeholder color for image
                marginBottom: "16px"

            }}>
                <img src={property.photos[0]} alt={property.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {/* Add project image here if available */}
            </div>

            {/* Content Container */}
            <div style={{ padding: "0 16px 16px" }}>
                {/* Project Name and Locality */}
                <h3 style={{
                    margin: "0 0 4px 0",
                    fontSize: "18px",
                    fontWeight: "600"
                }}>{property.name}</h3>
                <p style={{
                    margin: "0 0 16px 0",
                    color: "#666",
                    fontSize: "14px"
                }}>{property.locality}</p>

                {/* Configurations Section */}
                <div style={{ marginBottom: "16px" }}>
                    <p style={{
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        color: "#666"
                    }}>Configurations</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {(Array.isArray(property.bhk) ? property.bhk : [property.bhk])?.map((config, index) => (
                            <span key={index} style={{
                                padding: "4px 12px",
                                backgroundColor: "#E3F2FD",
                                borderRadius: "16px",
                                fontSize: "14px",
                                color: "#1976D2"
                            }}>
                                {config} BHK
                            </span>
                        ))}
                    </div>
                </div>

                {/* Project Type Section */}
                <div style={{ marginBottom: "16px" }}>
                    <p style={{
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        color: "#666"
                    }}>Project Type</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {(Array.isArray(property.propertyType) ? property.propertyType : [property.propertyType])?.map((type, index) => (
                            <span key={index} style={{
                                padding: "4px 12px",
                                backgroundColor: "#FFF8E1",
                                borderRadius: "16px",
                                fontSize: "14px",
                                color: "#FFA000"
                            }}>
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Price and Possession Status */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: "600"
                    }}>
                        ₹{property.price}
                    </p>
                    <span style={{
                        padding: "4px 12px",
                        backgroundColor: "#EEEEEE",
                        borderRadius: "16px",
                        fontSize: "14px",
                        color: "#424242"
                    }}>
                        {property.propertyType}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ResidentialPopUpCard;