
import geoJsonRussia from '../rus_simple_highcharts.geo.json';
import geoJsonWorld from '../world_geo.json';
import { rotateGeoJson } from '../utils/geoUtils';

export const fetchData = async (isWorldMap) => {
    const geoJson = isWorldMap ? geoJsonWorld : rotateGeoJson(geoJsonRussia);
    const response = await fetch('./data.json');
    const dataJson = await response.json();

    const dataMap = {};
    dataJson.data.forEach(region => {
        dataMap[region.code] = { color: region.color, coeff: region.coeff };
    });

    const dataArray = geoJson.features.map((feature) => {
        const regionCode = feature.properties['hc-key'];
        const dataEntry = dataMap[regionCode] || {};
        return {
            'hc-key': regionCode,
            value: dataEntry.coeff || 0,
            color: dataEntry.color || '#ccc'
        };
    });

    return { dataArray, geoJson };
};
