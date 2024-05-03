const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };
  
  const validateCoordinates = async (geo_coord) => {
    if (!Array.isArray(geo_coord) || geo_coord.length === 0) {
      throw { isValid: false, message: "Invalid geo_coord format" };
    }
  
    if (!areArraysEqual(geo_coord[0], geo_coord[geo_coord.length - 1])) {
      geo_coord.push([...geo_coord[0]]);
    }
  
    return {
      isValid: true,
      message: "Geofence coordinates validated successfully",
      correctedCoordinates: geo_coord,
    };
  };
  
  
export default validateCoordinates;
