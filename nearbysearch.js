var nearByList = [
    { lat: '7474.44', lng: '7585.00' },
    { lat: '7474.45', lng: '7585.01' },
    { lat: '7474.46', lng: '7585.02' },
    { lat: '7474.47', lng: '7585.03' },
    { lat: '7474.48', lng: '7585.04' },
    { lat: '7474.49', lng: '7585.05' },
    { lat: '7474.50', lng: '7585.06' },
    { lat: '7474.51', lng: '7585.07' },
    { lat: '7474.52', lng: '7585.08' },
    { lat: '7474.53', lng: '7585.09' },
    { lat: '7474.54', lng: '7585.10' },
    { lat: '7474.55', lng: '7585.11' },
    { lat: '7474.56', lng: '7585.12' },
    { lat: '7474.57', lng: '7585.13' },
    { lat: '7474.58', lng: '7585.14' },
    { lat: '7474.59', lng: '7585.15' },
    { lat: '6474.60', lng: '6585.16' },
    { lat: '7474.61', lng: '7585.17' },
    { lat: '7474.62', lng: '7585.18' },
    { lat: '7474.63', lng: '7585.19' }
]

var userNewLat_Lang = { lat: '6874.54', lng: '6885.10' };

function getNearByLat_lang() {
    // 1. Precalculate squared distances for efficiency
    const squaredDistances = nearByList.map(location => {
        const latDiff = location.lat - userNewLat_Lang.lat;
        const lngDiff = location.lng - userNewLat_Lang.lng;
        return latDiff * latDiff + lngDiff * lngDiff; // Squared distance
    });

    // 2. Find the index of the nearest location using the precalculated distances
    const nearestIndex = squaredDistances.indexOf(Math.min(...squaredDistances));

    // 3. Return the nearest location using the index
    return nearByList[nearestIndex];
}
console.log(getNearByLat_lang())
