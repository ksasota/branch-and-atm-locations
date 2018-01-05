const regCoords = {
  lat: /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/,
  lon: /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/
}

exports.validateLat = function(lat_coord){
  return regCoords.lat.test(lat_coord);
}

exports.validateLong = function(long_coord){
  return regCoords.lon.test(long_coord);
}
