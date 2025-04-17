import React, { useEffect } from 'react'
import { Box, Button, DialogContent, IconButton, Typography } from '@mui/material'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import "../../mapbox-gl-geocoder.css";
import { useLocale } from '../../locales';

function GetLocationDialog({ setOpenMap, lng, setLng, lat, setLat }) {
    const { formatMessage } = useLocale();

    useEffect(() => {
        mapboxgl.accessToken = `${import.meta.env.VITE_MAPBOX_TOKEN}`
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [
                lng || -5.92075661018373, lat || 32.474937151840166],
            zoom: 6
        });

        let points = []

        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        map.on('style.load', function () {

            map.on('click', function (e) {
                var coordinates = e?.lngLat;

                setLat(coordinates?.lat)
                setLng(coordinates?.lng)

                new mapboxgl.Marker(el).setLngLat([coordinates?.lng, coordinates?.lat]).addTo(map)
                new mapboxgl.Popup({ offset: 25 }).setLngLat(coordinates).setHTML(`
                    <div style="font-size: 14px">
                        <div>${formatMessage({ id: "merchants.create.yourlocation" })}:</div>
                        <div style="white-space: nowrap">Longitude: ${coordinates?.lng}</div>
                        <div style="white-space: nowrap">Latitude: ${coordinates?.lat}</div>
                    </div>
                `)
                    .addTo(map);

                points?.push([coordinates?.lng, coordinates?.lat])
            })
        });

        // Add the control to the map.
        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                countries: "GH,CI,TG,BJ,BF,NG,MA",
                mapboxgl: mapboxgl,
                marker: false,
            })
        );

        // map.scrollZoom.disable();
        map.addControl(new mapboxgl.NavigationControl());

        const [newLng, newLat] = [lng, lat]

        if (newLng && newLat) {
            new mapboxgl.Marker(el).setLngLat([newLng, newLat]).addTo(map)

            var bounds = [newLng, newLat]?.reduce(function (bounds, coord) {
                return bounds?.extend(coord);
            }, new mapboxgl.LngLatBounds([newLng - 0.01, newLat - 0.01], [newLng + 0.01, newLat + 0.01]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <DialogContent>
            <Typography variant='h6' mb={1}>{formatMessage({ id: "merchants.create.mapnote" })}</Typography>
            <Box sx={{ height: '25rem', borderRadius: '10px' }}>
                <div id="map" style={{ width: "100%", height: "100%" }} />
            </Box>
            <Box sx={{display: "flex", justifyContent: "center"}} mt={2.5}>
                <Button
                    onClick={() => setOpenMap(false)}
                    id="request-voucher"
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{
                        color: "var(--color-dark-blue)",
                        backgroundColor: "var(--color-cyan) !important",
                        borderRadius: "20px",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        border: "0 !important",
                        width: "20%"
                    }}
                >
                    {formatMessage({ id: "company.close" })}
                </Button>
            </Box>
        </DialogContent>
    )
}

export default GetLocationDialog