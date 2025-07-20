'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
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
  [key: string]: number; // Add index signature for dynamic access
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

  // Fix the function signature to remove unused parameter
  const getTrashIcon = useCallback((density: string) => {
    const color = getDensityColor(density);
    
    return L.divIcon({
      className: 'custom-trash-marker',
      html: `
        <div style="
          width: 28px;
          height: 28px;
          background-color: ${color};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          transform: translate(-50%, -50%);
        ">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M7 2v2c0 .55.45 1 1 1h1v1H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2V5h1c.55 0 1-.45 1-1V2H7zm2 3h6v1H9V5zm0 3h6v8H9V8z"/>
          </svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }, []);

  // Reverse geocoding function using internal API
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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
      // Fallback to coordinates only
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
  const getTrashTypeDetails = (type: string) => {
    const details: Record<string, {
      name: string;
      icon: string;
      description: string;
      environmental_impact: string;
      recyclable: boolean;
    }> = {
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

    // Only add markers if we have locations
    if (locations.length === 0) {
      return;
    }

    // Add markers for each location
    locations.forEach(location => {
      // For 'all' trash types, show one marker per location with total items
      if (selectedTrashType === 'all') {
        const marker = L.marker(
          [location.coordinates[0], location.coordinates[1]],
          { icon: getTrashIcon(location.density) }
        );

        // Create comprehensive popup content for all trash types
        const initialPopupContent = `
          <div style="min-width: 200px; padding: 12px; font-family: system-ui, sans-serif;">
            <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
              <h3 style="margin: 0; font-size: 15px; font-weight: bold; color: #1f2937;">
                🗑️ ${location.area}
              </h3>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">All Trash Types</p>
            </div>
            <div style="font-size: 12px; line-height: 1.4;">
              <div><strong>Total Items:</strong> ${location.totalItems}</div>
              <div><strong>Density:</strong> ${location.density}</div>
              <div style="margin-top: 8px;">
                <div>🍶 Plastic Bottles: ${location.breakdown.plasticBottles}</div>
                <div>📦 Food Containers: ${location.breakdown.foodContainers}</div>
                <div>🛍️ Plastic Bags: ${location.breakdown.plasticBags}</div>
                <div>🥫 Metal Cans: ${location.breakdown.metalCans}</div>
                <div>⭐ Other: ${location.breakdown.other}</div>
              </div>
            </div>
            <div style="margin-top: 8px; text-align: center; font-size: 10px; color: #6b7280;">
              Loading more details...
            </div>
          </div>
        `;

        marker.bindPopup(initialPopupContent, {
          maxWidth: 300,
          minWidth: 200,
          autoPan: true,
          closeButton: true,
          autoClose: true,
          className: 'custom-trash-popup'
        });

        // Enhanced click event for all trash types
        marker.on('click', async function(this: L.Marker, e: L.LeafletMouseEvent) {
          L.DomEvent.stopPropagation(e.originalEvent);
          onLocationSelect(location);
          this.openPopup();
          
          try {
            const address = await reverseGeocode(location.coordinates[0], location.coordinates[1]);
            const coordinates = formatCoordinates(location.coordinates[0], location.coordinates[1]);
            const collectionDate = new Date().toLocaleDateString();

            const detailedContent = `
              <div style="min-width: 260px; max-width: 320px; font-family: system-ui, sans-serif;">
                <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 8px;">
                  <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937; display: flex; align-items: center;">
                    <span style="font-size: 18px; margin-right: 6px;">🗑️</span>
                    ${location.area}
                  </h3>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Complete Waste Breakdown</p>
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

                <div style="margin-bottom: 8px; padding: 6px; background-color: #eff6ff; border-radius: 4px;">
                  <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #1d4ed8;">📊 Detailed Breakdown</h4>
                  <div style="font-size: 11px; color: #1e40af; line-height: 1.3;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 6px;">
                      <div style="display: flex; justify-content: space-between;">
                        <span>🍶 Bottles</span>
                        <strong>${location.breakdown.plasticBottles}</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span>📦 Containers</span>
                        <strong>${location.breakdown.foodContainers}</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span>🛍️ Bags</span>
                        <strong>${location.breakdown.plasticBags}</strong>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span>🥫 Cans</span>
                        <strong>${location.breakdown.metalCans}</strong>
                      </div>
                      <div style="grid-column: span 2; display: flex; justify-content: space-between;">
                        <span>⭐ Other</span>
                        <strong>${location.breakdown.other}</strong>
                      </div>
                    </div>
                    <div style="padding-top: 6px; border-top: 1px solid #dbeafe; font-weight: 600; text-align: center;">
                      📈 Total: ${location.totalItems} items
                    </div>
                  </div>
                </div>

                <div style="padding: 4px 6px; background-color: #f3f4f6; border-radius: 4px; font-size: 10px; color: #6b7280; text-align: center;">
                  📅 Updated: ${collectionDate}
                </div>
              </div>
            `;
            
            this.setPopupContent(detailedContent);
            
          } catch (error) {
            console.error('Failed to load detailed popup:', error);
            this.setPopupContent(`
              <div style="padding: 16px; color: #dc2626; text-align: center;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px;">❌ Error</h3>
                <p style="margin: 0; font-size: 12px;">Failed to load details</p>
              </div>
            `);
          }
        });

        marker.addTo(mapInstanceRef.current!);
        markersRef.current.push(marker);
      } else {
        // For specific trash type, only show marker if that type exists at this location
        const count = location.breakdown[selectedTrashType as keyof typeof location.breakdown];
        if (count && count > 0) {
          const marker = L.marker(
            [location.coordinates[0], location.coordinates[1]],
            { icon: getTrashIcon(location.density) }
          );

          const trashDetails = getTrashTypeDetails(selectedTrashType);
          
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

          marker.bindPopup(initialPopupContent, {
            maxWidth: 300,
            minWidth: 200,
            autoPan: true,
            closeButton: true,
            autoClose: true,
            className: 'custom-trash-popup'
          });

          // Specific trash type click event
          marker.on('click', async function(this: L.Marker, e: L.LeafletMouseEvent) {
            L.DomEvent.stopPropagation(e.originalEvent);
            onLocationSelect(location);
            this.openPopup();
            
            try {
              const address = await reverseGeocode(location.coordinates[0], location.coordinates[1]);
              const coordinates = formatCoordinates(location.coordinates[0], location.coordinates[1]);
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
              
              this.setPopupContent(detailedContent);
              
            } catch (error) {
              console.error('Failed to load detailed popup:', error);
              this.setPopupContent(`
                <div style="padding: 16px; color: #dc2626; text-align: center;">
                  <h3 style="margin: 0 0 8px 0; font-size: 14px;">❌ Error</h3>
                  <p style="margin: 0; font-size: 12px;">Failed to load details</p>
                </div>
              `);
            }
          });

          marker.addTo(mapInstanceRef.current!);
          markersRef.current.push(marker);
        }
      }
    });

    // Fit map to show all markers if there are locations and markers were added
    if (locations.length > 0 && markersRef.current.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [locations, selectedLocation, selectedTrashType, onLocationSelect, getTrashIcon]);

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