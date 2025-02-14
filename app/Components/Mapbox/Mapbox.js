"use client"; // Ensure this directive is present

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGlobalContext } from "@/app/context/globalContext";

function FlyToActiveCity({ activeCityCords }) {
    const map = useMap();

    useEffect(() => {
        if (activeCityCords) {
            const zoomLev = 13;
            const flyToOptions = {
                duration: 1.5,
            };

            map.flyTo([activeCityCords.lat, activeCityCords.lon], zoomLev, flyToOptions);
        }
    }, [activeCityCords, map]);

    return null;
}

function Mapbox() {
    const { forecast } = useGlobalContext();
    const activeCityCords = forecast?.coord;

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !forecast || !forecast.coord || !activeCityCords) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="flex-1 basis-[50%] border rounded-lg">
            <div style={{ height: "400px", width: "100%", borderRadius: "1rem", overflow: "hidden" }}>
                <MapContainer
                    center={[activeCityCords.lat, activeCityCords.lon]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <FlyToActiveCity activeCityCords={activeCityCords} />
                </MapContainer>
            </div>
        </div>
    );
}

export default Mapbox;
