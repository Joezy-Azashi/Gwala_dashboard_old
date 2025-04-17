import React, { useEffect, useState } from 'react'
import { Box, Button, InputAdornment, TextField, Tooltip, Typography } from '@mui/material'
import mapboxgl from 'mapbox-gl'
import * as turf from "@turf/turf";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import cover from '../../assets/cover2.png'
import { Add, Close, Search } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { useLocale } from '../../locales';
import axiosMerchant from '../../api/merchantRequest';

const ManagePartnerMap = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { formatMessage } = useLocale();
    const [lng, setLng] = useState(-5.35278326);
    const [lat, setLat] = useState(30.6921767);
    const [geoType, setGeoType] = useState("")
    const [query, setQuery] = useState('');
    const [cords, setCords] = useState([])
    const [results, setResults] = useState([])

    const handleSearch = (e) => {
        const input = e.target.value;
        setQuery(input);

        if (input === '') {
            setResults(cords)
        } else if (input.includes(',')) {
            // Handle coordinates search
            const coords = input.split(',').map(coord => parseFloat(coord.trim()));
            if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                const filtered = cords.filter(item => {
                    const [lat, lon] = item.features[0].geometry.coordinates;
                    return lat === coords[0] && lon === coords[1];
                });
                setResults(filtered);
            } else {
                setResults([]);
            }
        } else {
            // Handle name search
            const filtered = cords.filter(item =>
                item.features[0].name.toLowerCase().includes(input.toLowerCase())
            );
            setResults(filtered);
        }
    };

    const getMapData = () => {
        setCords([])
        setResults([])
        const whereGeolocation = {
            ...((geoType && { isMerchant: geoType }) || {}),
        };

        if (id) {
            axiosMerchant.get(`/locations/${id}`, {
                params: {
                    filter: {
                        fields: {
                            name: true,
                            id: true,
                            geoPoint: true,
                            logo: true,
                            color: true
                        }
                    }
                }
            })
                .then((res) => {
                    function validateLatitude(lat) {
                        if (lat < -90) {
                            return -90;
                        } else if (lat > 90) {
                            return 90;
                        }
                        return lat;
                    }

                    setCords((prev) => [...prev, {
                        features: [
                            {
                                id: res?.data?.id,
                                name: res?.data?.name,
                                image: res?.data?.logo,
                                color: res?.data?.color,
                                geometry: {
                                    coordinates: [res?.data?.geoPoint?.coordinates[0], validateLatitude(res?.data?.geoPoint?.coordinates[1])]
                                }
                            }
                        ]
                    }])
                    setResults((prev) => [...prev, {
                        features: [
                            {
                                id: res?.data?.id,
                                name: res?.data?.name,
                                image: res?.data?.logo,
                                color: res?.data?.color,
                                geometry: {
                                    coordinates: [res?.data?.geoPoint?.coordinates[0], validateLatitude(res?.data?.geoPoint?.coordinates[1])]
                                }
                            }
                        ]
                    }])
                })
                .catch((error) => {

                })
        } else {
            axiosMerchant.get(`/locations`, {
                params: {
                    filter: {
                        where: {
                            ...whereGeolocation
                        },
                        fields: {
                            name: true,
                            id: true,
                            geoPoint: true,
                            logo: true,
                            color: true
                        }
                    }
                }
            })
                .then((res) => {
                    res?.data?.map((data) => {
                        function validateLatitude(lat) {
                            if (lat < -90) {
                                return -90;
                            } else if (lat > 90) {
                                return 90;
                            }
                            return lat;
                        }

                        setCords((prev) => [...prev, {
                            features: [
                                {
                                    id: data?.id,
                                    name: data?.name,
                                    image: data?.logo,
                                    color: data?.color,
                                    geometry: {
                                        coordinates: [data?.geoPoint?.coordinates[0], validateLatitude(data?.geoPoint?.coordinates[1])]
                                    }
                                }
                            ]
                        }])
                        setResults((prev) => [...prev, {
                            features: [
                                {
                                    id: data?.id,
                                    name: data?.name,
                                    image: data?.logo,
                                    color: data?.color,
                                    geometry: {
                                        coordinates: [data?.geoPoint?.coordinates[0], validateLatitude(data?.geoPoint?.coordinates[1])]
                                    }
                                }
                            ]
                        }])
                    })
                })
                .catch((error) => {

                })
        }
    }

    useEffect(() => {
        getMapData()
    }, [geoType])

    useEffect(() => {
        mapboxgl.accessToken = "pk.eyJ1IjoiYXphc2hpIiwiYSI6ImNscmVzeWs5bTFmbG0yc3MwcXlmaHk4YmMifQ.eLB0pfpgY__6UWbmWuWPWQ"
        var map = new mapboxgl.Map({
            container: 'map',
            renderWorldCopies: false,
            style: 'mapbox://styles/mapbox/navigation-day-v1',
            center: [lng, lat],
            zoom: 9
        });

        map.on('load', function () {
            // Remove the name label for Western Sahara
            const layers = map.getStyle().layers;
    
            for (const layer of layers) {
                if (layer.type === 'symbol' && layer.layout['text-field']) {
                    map.setFilter(layer.id, [
                        'all',
                        ['!=', ['get', 'iso_3166_1'], 'EH']
                    ]);
                }
            }
    
            // Remove the dashed border line for Western Sahara
            map.addSource('boundaries', {
                type: 'vector',
                url: 'mapbox://mapbox.boundaries-v3'
            });
    
            map.addLayer({
                'id': 'country-boundaries',
                'type': 'line',
                'source': 'boundaries',
                'source-layer': 'boundaries_admin_0',
                'paint': {
                    'line-color': '#FF0000',
                    'line-width': 2
                },
                'filter': [
                    'all',
                    ['!=', 'iso_3166_1', 'EH'],
                    ['!=', 'disputed', true], // If there is a property that indicates disputed borders
                    [
                        'any',
                        ['!=', 'iso_3166_1_left', 'MA'], ['!=', 'iso_3166_1_right', 'EH'],
                        ['!=', 'iso_3166_1_left', 'EH'], ['!=', 'iso_3166_1_right', 'MA']
                    ]
                ]
            });
        });

        map.on('load', () => {
            let _center = turf.point([lng, lat]);
            let _radius = 25;
            let _options = {
                steps: 80,
                units: 'kilometers' // or "mile"
            };

            let _circle = turf.circle(_center, _radius, _options);

            map.addSource("circleData", {
                type: "geojson",
                data: _circle,
            });

            map.addLayer({
                id: "circle-fill",
                type: "fill",
                source: "circleData",
                paint: {
                    "fill-color": "#03254C",
                    "fill-opacity": 0.1,
                },
            });
        });

        let points = []

        // add markers to map
        for (const feature of results) {
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = 'marker';

            // make a marker for each feature and add to the map
            const marker = new mapboxgl.Marker(el).setLngLat(feature?.features[0]?.geometry?.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(`
                        <div style="display: flex; justify-content: space-evenly; align-items: center; gap: 5px">
                            <img style="min-width: 50px; height: 3rem; object-fit: contain" src=${!feature?.features[0]?.image ? cover : feature?.features[0]?.image} alt="image" />
                            <p>${feature?.features[0]?.name || "-"}</p>
                        </div>
                        `)
                )
                .addTo(map);
            const markerDiv = marker.getElement();

            markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
            markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
            markerDiv.addEventListener('click', () => toSingleProperty(feature?.features[0]));

            //adding array of markers
            points?.push(feature?.features[0]?.geometry?.coordinates)
        }

        // map.scrollZoom.disable();
        map.addControl(new mapboxgl.NavigationControl());

        //setting the map boundary around the markers
        if (points?.length > 0) {
            var bounds = points?.reduce(function (bounds, coord) {
                return bounds?.extend(coord);
            }, new mapboxgl.LngLatBounds(points[0], points[0]));
            // const bounds = [
            //     [-25.0, -35.0],
            //     [60.0, 38.0]
            // ];

            //with bounds fit the map
            try {
                if (bounds) {
                    map.fitBounds(bounds, {
                        padding: 100
                    });
                }
            } catch (e) {

            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cords, geoType, results])

    return (
        <Box sx={{ height: 'calc(100vh)', }}>
            <div id="map" style={{ height: "100%" }} />

            {/* add partner */}
            <Box
                onClick={() => navigate(`/partner-profile`)}
                sx={{
                    position: "fixed",
                    bottom: "40px",
                    right: "35px",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#1267B1",
                    borderRadius: "50%",
                    cursor: "pointer",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Add fontSize="medium" style={{ color: "white" }} />
                    <Typography fontSize={"9px"} color={"#fff"} fontWeight={600}>Partner</Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    position: "fixed",
                    top: "9rem",
                    left: "50px",
                }}
            >
                <TextField
                    type="text"
                    variant='outlined'
                    size="small"
                    sx={{
                        '& .MuiInputBase-root': {
                            borderRadius: "40px",
                            backgroundColor: "#fff",
                            width: "29.8rem"
                        }
                    }}
                    value={query}
                    onChange={handleSearch}
                    placeholder={formatMessage({ id: "merchants.create.mapsearchplaceholder" })}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position='end'>
                            {query?.length > 0 &&
                                <Tooltip title={formatMessage({ id: "merchants.clearsearch" })} arrow>
                                    <Close onClick={() => setQuery("")}
                                        sx={{ cursor: "pointer" }} />
                                </Tooltip>
                            }
                        </InputAdornment>
                    }}
                />
            </Box>

            {!id &&
                <Box>
                    <Button
                        onClick={() => setGeoType("false")}
                        id="partners"
                        variant="outlined"
                        size="large"
                        startIcon={<img src="/icons/map.svg" width={20} />}
                        sx={{
                            position: "fixed",
                            top: "12rem",
                            left: "210px",
                            color: "#000",
                            backgroundColor: geoType === "false" ? "var(--color-cyan) !important" : "#fff !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            border: "0 !important"
                        }}
                    >
                        {formatMessage({ id: "merchants.partners" })}
                    </Button>

                    <Button
                        onClick={() => setGeoType("true")}
                        id="merchants"
                        variant="outlined"
                        size="large"
                        startIcon={<img src="/icons/house2.svg" width={20} />}
                        sx={{
                            position: "fixed",
                            top: "12rem",
                            left: "50px",
                            color: "#000",
                            backgroundColor: geoType === "true" ? "var(--color-cyan) !important" : "#fff !important",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            fontWeight: "600",
                            border: "0 !important"
                        }}
                    >
                        {formatMessage({ id: "merchants.merchants" })}
                    </Button>
                </Box>
            }
        </Box >
    )
}

export default ManagePartnerMap