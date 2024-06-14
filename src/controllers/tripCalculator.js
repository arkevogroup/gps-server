
async function haversineCalc(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers

    const radLat = ((lat2 - lat1) * Math.PI) / 180;
    const radLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(radLat / 2) * Math.sin(radLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(radLon / 2) * Math.sin(radLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default haversineCalc;