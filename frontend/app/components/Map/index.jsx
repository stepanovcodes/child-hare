'use client'

import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles
import './Map.css'; // Create a CSS file for styling if needed

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN; // Replace with your Mapbox access token

const Map = ({childCares}) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-110.67720259780971, 50.020035048603965],
      zoom: 12,
    });

    // Filter out childCares with non-null latitudes and longitudes
    const validChildCares = childCares.filter((childCare) => childCare.latitude !== null && childCare.longitude !== null);

    map.on('load', () => {
      map.addSource('childCares', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: validChildCares.map(validChildCare => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [validChildCare.longitude, validChildCare.latitude],
            },
            properties: {
              uuid: validChildCare.uuid,
              name: validChildCare.name,
              type: validChildCare.type,
              address: validChildCare.address,
              city: validChildCare.city,
              province: validChildCare.province,
              postalCode: validChildCare.postalCode,
              phoneNumber: validChildCare.phoneNumber,
              capacity: validChildCare.capacity,
              website: validChildCare.website,
              googleRating: validChildCare.googleRating
            },
          })),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'childCares',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'childCares',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'childCares',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('childCares').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          }
        );
      });

      map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const name = capitalizeEachWord(e.features[0].properties.name);
        const type = 
          e.features[0].properties.type.toLowerCase();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `Name: ${name}<br>Type: ${type}`
          )
          .addTo(map);
      });

      map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => map.remove(); // Clean up when the component unmounts
  }, []);

  const capitalizeEachWord = (str) => {
    return str
    .split(' ') // Split the string into an array of words
    .map(word => {
      // Capitalize the first letter and convert the rest to lowercase for each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' '); // Join the words back into a single string with spaces
  }

  return <div id="map" className="map-container"></div>;
};

export default Map;