import { ResidentialProperty } from '../services/PropertyService';
import styles from '../styles/customMarker.module.css';
import { formatIndianPrice } from './Utils';
/**
 * Creates a custom marker element for residential properties
 * Using a combination of inline styles and Tailwind-like class names
 */
export function createCustomMarkerContent(property: ResidentialProperty): HTMLElement {
  // Create container element
  const container = document.createElement('div');
  container.className = 'custom-marker-container';
  container.style.cursor = 'pointer';
  
  // Create marker content
  const content = document.createElement('div');
  content.className = 'custom-marker';
  
  // Apply styles to mimic Tailwind classes
  Object.assign(content.style, {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#60B5F4',
    borderRadius: '9999px',
    padding: '10px 16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    position: 'relative'
  });
  
  // Add the speech bubble pointer
  const afterElement = document.createElement('div');
  Object.assign(afterElement.style, {
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '10px solid #60B5F4'
  });
  
  // Create house icon
  const iconContainer = document.createElement('div');
  Object.assign(iconContainer.style, {
    marginRight: '10px',
    position: 'relative',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });
  
  const houseIcon = document.createElement('div');
  Object.assign(houseIcon.style, {
    position: 'absolute',
    left: '2.8%',
    right: '2.69%',
    top: '9.41%',
    bottom: '9.53%',
    width: '10px',
    height: '10px',
    backgroundColor: '#111928',
    WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath d='M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z'/%3E%3C/svg%3E\")",
    maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath d='M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z'/%3E%3C/svg%3E\")",
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    flex: 'none',
    order: '0',
    flexGrow: '0',
    zIndex: '0'
  });
  
  // Create price text
  const priceContainer = document.createElement('div');
  Object.assign(priceContainer.style, {
    fontFamily: 'sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111928'
  });
  
  // Format the price (assuming price is in lakhs)
  priceContainer.textContent = formatIndianPrice(property.price);
  
  // Assemble the marker
  iconContainer.appendChild(houseIcon);
  content.appendChild(iconContainer);
  content.appendChild(priceContainer);
  content.appendChild(afterElement);
  container.appendChild(content);
  
  return container;
}

/**
 * Tailwind-compatible approach: Create a custom marker using CSS Module classes
 * This approach requires adding the styles/customMarker.module.css file
 * which uses Tailwind's @apply directives
 */
export function createCustomMarkerWithTailwind(property: ResidentialProperty): HTMLElement {
  // Create the main container
  const container = document.createElement('div');
  container.className = styles['custom-marker-container'];
  
  // Create the marker content
  const content = document.createElement('div');
  content.className = styles['custom-marker'];
  
  // Create house icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = styles['house-icon-container'];
  
  // Create house icon
  const houseIcon = document.createElement('div');
  houseIcon.className = styles['house-icon'];
  
  // Create price container
  const priceContainer = document.createElement('div');
  priceContainer.className = styles['price-container'];
  priceContainer.textContent = formatIndianPrice(property.price);
  
  // Assemble the marker
  iconContainer.appendChild(houseIcon);
  content.appendChild(iconContainer);
  content.appendChild(priceContainer);
  container.appendChild(content);
  
  return container;
} 