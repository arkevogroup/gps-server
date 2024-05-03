
// Generate 10 latitude coordinates
const latitudes = Array.from({ length: 10 }, () => Math.random() * (90 - (-90)) - 90);

// Generate 10 longitude coordinates
const longitudes = Array.from({ length: 10 }, () => Math.random() * (180 - (-180)) - 180);


console.log([latitudes,longitudes]);


