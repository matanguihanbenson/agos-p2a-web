'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TrashBreakdown {
  plasticBottles: number;
  foodContainers: number;
  plasticBags: number;
  metalCans: number;
  other: number;
}

interface TrashLocation {
  id: string;
  area: string;
  coordinates: number[];
  totalItems: number;
  breakdown: TrashBreakdown;
  density: string;
}

interface TrashDepositsMapProps {
  locations: TrashLocation[];
  onLocationSelect: (location: TrashLocation) => void;
  selectedLocation: TrashLocation | null;
  selectedTrashType?: string;
}

const TrashDepositsMap: React.FC<TrashDepositsMapProps> = ({
  locations,
  onLocationSelect,
  selectedLocation,
  selectedTrashType = 'all'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'Very High': return '#ef4444'; // red-500
      case 'High': return '#f97316'; // orange-500
      case 'Medium': return '#eab308'; // yellow-500
      case 'Low': return '#22c55e'; // green-500
      default: return '#6b7280'; // gray-500
    }
  };

  const createCustomIcon = (density: string, isSelected: boolean = false) => {
    const color = getDensityColor(density);
    const size = isSelected ? 40 : 30;
    const borderWidth = isSelected ? 4 : 2;
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: ${borderWidth}px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size > 30 ? '14px' : '12px'};
          position: relative;
          transform: translate(-50%, -50%);
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const getTrashIcon = (type: string, density: string, isSelected: boolean = false) => {
    const color = getDensityColor(density);
    const size = isSelected ? 35 : 28;
    const borderWidth = isSelected ? 3 : 2;
    
    const icons: { [key: string]: string } = {
      plasticBottles: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M7 2v2c0 .55.45 1 1 1h1v1H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2V5h1c.55 0 1-.45 1-1V2H7zm2 3h6v1H9V5zm0 3h6v8H9V8z"/>
      </svg>`,
      foodContainers: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3s-3 1.34-3 3c0 .35.07.69.18 1H8.82C8.93 5.69 9 5.35 9 5c0-1.66-1.34-3-3-3S3 3.34 3 5c0 .35.07.69.18 1H1c-.55 0-1 .45-1 1s.45 1 1 1h1.64L4 19c.1 1.1 1 2 2.1 2h11.8c1.1 0 2-.9 2.1-2l1.36-11H23c.55 0 1-.45 1-1s-.45-1-1-1z"/>
      </svg>`,
      plasticBags: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M8 6v2h8V6c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2zm10 2v10c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8H4c-.55 0-1-.45-1-1s.45-1 1-1h16c.55 0 1 .45 1 1s-.45 1-1 1h-2z"/>
      </svg>`,
      metalCans: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>`,
      other: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>`
    };

    return L.divIcon({
      className: 'custom-trash-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: ${borderWidth}px solid white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          transform: translate(-50%, -50%);
        ">
          ${icons[type] || icons.other}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        // Format the address nicely
        const address = data.address || {};
        const parts = [
          address.house_number,
          address.road,
          address.neighbourhood || address.suburb,
          address.city || address.town || address.municipality,
          address.state,
          address.country
        ].filter(Boolean);
        
        return parts.join(', ') || data.display_name;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Format coordinates for display
  const formatCoordinates = (lat: number, lng: number): string => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
  };

  // Get trash type details
  const getTrashTypeDetails = (type: string, count: number) => {
    const details: { [key: string]: any } = {
      plasticBottles: {
        name: 'Plastic Bottles',
        icon: '🍶',
        description: 'Single-use plastic bottles',
        environmental_impact: 'Takes 450+ years to decompose',
        recyclable: true
      },
      foodContainers: {
        name: 'Food Containers',
        icon: '📦',
        description: 'Takeaway containers and food packaging',
        environmental_impact: 'Can contaminate waterways',
        recyclable: false
      },
      plasticBags: {
        name: 'Plastic Bags',
        icon: '🛍️',
        description: 'Shopping bags and plastic wrapping',
        environmental_impact: 'Deadly to marine life',
        recyclable: false
      },
      metalCans: {
        name: 'Metal Cans',
        icon: '🥫',
        description: 'Aluminum and steel beverage/food cans',
        environmental_impact: 'Highly recyclable material',
        recyclable: true
      },
      other: {
        name: 'Other Debris',
        icon: '⭐',
        description: 'Miscellaneous waste items',
        environmental_impact: 'Various environmental impacts',
        recyclable: false
      }
    };

    return details[type] || details.other;
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([14.5995, 120.9842], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to bottom-right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for each location and trash type
    locations.forEach(location => {
      const isSelected = selectedLocation?.id === location.id;
      
      // Determine which trash types to show
      const trashTypesToShow = selectedTrashType === 'all' 
        ? ['plasticBottles', 'foodContainers', 'plasticBags', 'metalCans', 'other']
        : [selectedTrashType];

      trashTypesToShow.forEach((trashType, index) => {
        const count = (location.breakdown as any)[trashType];
        if (count && count > 0) {
          // Offset markers slightly when showing multiple types
          const latOffset = index * 0.001;
          const lngOffset = index * 0.001;
          const markerLat = location.coordinates[0] + latOffset;
          const markerLng = location.coordinates[1] + lngOffset;
          
          const marker = L.marker(
            [markerLat, markerLng],
            { icon: getTrashIcon(trashType, location.density, isSelected) }
          );

          // Get trash type details
          const trashDetails = getTrashTypeDetails(trashType, count);
          
          // Create initial popup content (simple version)
          const initialPopupContent = `
            <div style="min-width: 200px; padding: 12px; font-family: system-ui, sans-serif;">
              <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
                <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #1f2937;">
                  ${trashDetails.icon} ${trashDetails.name}
                </h3>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">${location.area}</p>
              </div>
              <div style="font-size: 12px; line-height: 1.4;">
                <div><strong>Count:</strong> ${count} items</div>
                <div><strong>Density:</strong> ${location.density}</div>
                <div><strong>Type:</strong> ${trashDetails.description}</div>
                <div><strong>Recyclable:</strong> ${trashDetails.recyclable ? 'Yes' : 'No'}</div>
              </div>
              <div style="margin-top: 8px; text-align: center; font-size: 10px; color: #6b7280;">
                Loading more details...
              </div>
            </div>
          `;

          // Create and bind popup with initial content
          marker.bindPopup(initialPopupContent, {
            maxWidth: 300,
            minWidth: 200,
            autoPan: true,
            closeButton: true,
            autoClose: true,
            className: 'custom-trash-popup'
          });

          // Add click event with detailed content loading
          marker.on('click', async function(this: L.Marker, e: L.LeafletMouseEvent) {
            // Stop event propagation to prevent map zoom
            L.DomEvent.stopPropagation(e.originalEvent);
            
            // Call location select handler
            onLocationSelect(location);
            
            // Open popup immediately with initial content
            this.openPopup();
            
            // Load detailed content asynchronously
            try {
              const address = await reverseGeocode(markerLat, markerLng);
              const coordinates = formatCoordinates(markerLat, markerLng);
              const collectionDate = new Date().toLocaleDateString();
              const totalAreaItems = location.totalItems;
              const percentage = ((count / totalAreaItems) * 100).toFixed(1);

              const detailedContent = `
                <div style="min-width: 240px; max-width: 300px; font-family: system-ui, sans-serif;">
                  <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937; display: flex; align-items: center;">
                      <span style="font-size: 18px; margin-right: 6px;">${trashDetails.icon}</span>
                      ${trashDetails.name}
                    </h3>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">${location.area}</p>
                  </div>

                  <div style="margin-bottom: 8px; padding: 6px; background-color: #f9fafb; border-radius: 4px;">
                    <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #374151;">📍 Location</h4>
                    <div style="font-size: 11px; color: #6b7280; line-height: 1.4;">
                      <div style="margin-bottom: 2px;"><strong>Address:</strong> ${address}</div>
                      <div style="margin-bottom: 2px;"><strong>Coordinates:</strong> ${coordinates}</div>
                      <div><strong>Density:</strong> 
                        <span style="display: inline-block; width: 8px; height: 8px; background-color: ${getDensityColor(location.density)}; border-radius: 50%; margin: 0 4px;"></span>
                        ${location.density}
                      </div>
                    </div>
                  </div>

                  <div style="margin-bottom: 8px; padding: 6px; background-color: #fef3c7; border-radius: 4px;">
                    <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #92400e;">🗑️ Details</h4>
                    <div style="font-size: 11px; color: #78716c; line-height: 1.4;">
                      <div style="margin-bottom: 2px;"><strong>Type:</strong> ${trashDetails.description}</div>
                      <div style="margin-bottom: 2px;"><strong>Count:</strong> ${count} items (${percentage}%)</div>
                      <div style="margin-bottom: 2px;"><strong>Recyclable:</strong> ${trashDetails.recyclable ? '♻️ Yes' : '❌ No'}</div>
                      <div><strong>Impact:</strong> ${trashDetails.environmental_impact}</div>
                    </div>
                  </div>

                  <div style="margin-bottom: 8px; padding: 6px; background-color: #eff6ff; border-radius: 4px;">
                    <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #1d4ed8;">📊 Area Breakdown</h4>
                    <div style="font-size: 10px; color: #1e40af; line-height: 1.3;">
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px;">
                        <div>🍶 ${location.breakdown.plasticBottles}</div>
                        <div>📦 ${location.breakdown.foodContainers}</div>
                        <div>🛍️ ${location.breakdown.plasticBags}</div>
                        <div>🥫 ${location.breakdown.metalCans}</div>
                        <div style="grid-column: span 2;">⭐ ${location.breakdown.other}</div>
                      </div>
                      <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #dbeafe; font-weight: 600; text-align: center;">
                        📈 Total: ${totalAreaItems} items
                      </div>
                    </div>
                  </div>

                  <div style="padding: 4px 6px; background-color: #f3f4f6; border-radius: 4px; font-size: 10px; color: #6b7280; text-align: center;">
                    📅 Updated: ${collectionDate}
                  </div>
                </div>
              `;
              
              // Update popup content with detailed information
              this.setPopupContent(detailedContent);
              
            } catch (error) {
              console.error('Failed to load detailed popup:', error);
              this.setPopupContent(`
                <div style="padding: 16px; color: #dc2626; text-align: center;">
                  <h3 style="margin: 0 0 8px 0; font-size: 14px;">❌ Error</h3>
                  <p style="margin: 0; font-size: 12px;">Failed to load details. Click again to retry.</p>
                </div>
              `);
            }
          });

          marker.addTo(mapInstanceRef.current!);
          markersRef.current.push(marker);
        }
      });
    });

    // Fit map to show all markers if there are locations
    if (locations.length > 0 && markersRef.current.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [locations, selectedLocation, selectedTrashType, onLocationSelect]);

  // Center map on selected location
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [selectedLocation.coordinates[0], selectedLocation.coordinates[1]], 
        14,
        { animate: true }
      );
    }
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      {/* Add CSS for popup animation and styling */}
      <style jsx global>{`
        @keyframes leaflet-popup-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }
        
        .leaflet-popup-content {
          margin: 12px 14px;
          line-height: 1.4;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .custom-trash-popup .leaflet-popup-close-button {
          color: #6b7280;
          font-size: 18px;
          padding: 4px 8px;
          font-weight: bold;
          right: 6px;
          top: 6px;
        }
        
        .custom-trash-popup .leaflet-popup-close-button:hover {
          color: #374151;
          background-color: #f3f4f6;
          border-radius: 6px;
        }
        
        .custom-marker,
        .custom-trash-marker {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        
        .leaflet-popup-scrolled {
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }
      `}</style>
      
      {/* Map Legend */}
      <div className="absolute bottom-20 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
        
        {/* Trash Types */}
        <div className="mb-3">
          <h5 className="text-xs font-medium text-gray-700 mb-1">Trash Types</h5>
          <div className="space-y-1">
            {[
              { type: 'Plastic Bottles', icon: '🍶', key: 'plasticBottles' },
              { type: 'Food Containers', icon: '📦', key: 'foodContainers' },
              { type: 'Plastic Bags', icon: '🛍️', key: 'plasticBags' },
              { type: 'Metal Cans', icon: '🥫', key: 'metalCans' },
              { type: 'Other Debris', icon: '⭐', key: 'other' },
            ].map((item) => (
              <div key={item.key} className="flex items-center space-x-2">
                <span className="text-xs">{item.icon}</span>
                <span className="text-xs text-gray-700">{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Density Levels */}
        <div>
          <h5 className="text-xs font-medium text-gray-700 mb-1">Density Levels</h5>
          <div className="space-y-1">
            {[
              { level: 'Very High', color: '#ef4444' },
              { level: 'High', color: '#f97316' },
              { level: 'Medium', color: '#eab308' },
              { level: 'Low', color: '#22c55e' },
             ].map((item) => (
              <div key={item.level} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded border border-white shadow-sm"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-gray-700">{item.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Controls Info */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <p className="text-xs text-gray-600">
          Click markers for details • Drag to pan • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default TrashDepositsMap;