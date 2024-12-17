
export const rotateGeoJson = (geoJson, angle = -15) => {
    const radians = angle * (Math.PI / 180);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    const rotatedGeoJson = JSON.parse(JSON.stringify(geoJson));
    rotatedGeoJson.features.forEach((feature) => {
        feature.geometry.coordinates.forEach((polygon) => {
            polygon.forEach((coords) => {
                coords.forEach((point) => {
                    const x = point[0] * cos - point[1] * sin;
                    const y = point[0] * sin + point[1] * cos;
                    point[0] = x;
                    point[1] = y;
                });
            });
        });
    });
    return rotatedGeoJson;
};
