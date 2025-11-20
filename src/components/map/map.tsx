import { useEffect, useRef } from 'react';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer } from '../../types/offer';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

type MapProps = {
  offers: Offer[];
  activeOfferId?: string | null;
};

function Map({ offers, activeOfferId }: MapProps): JSX.Element | null {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || offers.length === 0) {
      return;
    }

    const city = offers[0].city;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [city.location.latitude, city.location.longitude],
        zoom: city.location.zoom,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current as L.LayerGroup;

    const defaultIcon = new Icon({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const activeIcon = new Icon({
      iconUrl: '/img/pin-active.svg',
      iconSize: [27, 39],
      iconAnchor: [13, 39],
    });

    markersLayer.clearLayers();

    offers.forEach((offer) => {
      const marker = L.marker(
        [offer.location.latitude, offer.location.longitude],
        { icon: offer.id === activeOfferId ? activeIcon : defaultIcon }
      );
      marker.addTo(markersLayer);
    });

    map.setView(
      [city.location.latitude, city.location.longitude],
      city.location.zoom
    );
  }, [offers, activeOfferId]);

  return <div ref={mapRef} style={{ height: '100%' }} />;
}

export default Map;
