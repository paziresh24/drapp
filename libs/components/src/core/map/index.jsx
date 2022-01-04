import styles from './map.module.scss';
import 'leaflet/dist/leaflet.css';
import marker from './marker.png';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';

const GetCenter = ({ sendPosition, lanLng, zoom, setZoom }) => {
    const map = useMapEvents({
        click: () => {
            setZoom(undefined);
        },
        dragend: () => {
            sendPosition(map.getCenter());
            setZoom(undefined);
        }
    });

    useEffect(() => {
        if (lanLng[0] && lanLng[1]) {
            map.setView(lanLng, zoom);
        }
    }, [lanLng]);

    useEffect(() => {
        map.locate({ setView: true, maxZoom: 20 });
    }, []);

    return null;
};

const Map = ({ lat, lng, sendPosition, province, city, zoom, setZoom }) => {
    return (
        <MapContainer id={styles['map']} center={[lat, lng]} zoom={20} scrollWheelZoom>
            <GetCenter
                sendPosition={sendPosition}
                lanLng={[lat, lng]}
                zoom={zoom}
                setZoom={setZoom}
            />
            <TileLayer
                attribution="پذیرش۲۴"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <img src={marker} alt="" className={styles['map-marker-centered']} />
        </MapContainer>
    );
};

export default Map;
