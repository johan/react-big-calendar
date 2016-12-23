import events from '../events';
import colorbrewer from '../colorbrewer';

let haievents = events;

let places = 'aus/ca/de/east/midwest/norcal/socal/uk'.split('/'); // 8
let colour = colorbrewer.Set3[places.length + 1];
let styles = {}; // indexed on event.in (aus/ca/de/east/midwest/norcal/socal/uk)

let center =
{ aus:    [-32.7278575,  151.2604738, 'Hunter Valley']
, ca:      [43.9888232,  -80.0262646, 'Ecology Retreat Centre']
, de:      [52.0668495,    7.2107544, 'Seminarhof']
, east:    [42.4965698,  -72.9462321, 'Earthdance']
, midwest: [40.1591988,  -85.2805088, 'Oakwood Retreat Center']
, norcal:  [38.5369205, -123.0701147, 'Wildwood']
, socal:   [34.1349793, -116.3599965, 'Joshua Tree Retreat Center']
, uk:      [51.2727283,   -2.4157968, 'Ammerdown']
};

let regions = [];
let getRegions = () => regions;

let getClosestSite = ({latitude, longitude}) => {
  let me = [latitude, longitude];
  let site = null;
  let closest = Infinity;

  for (let region in center) {
    let distance = haversineAngularDistance(me, center[region]);
    let kilometers = 6371 * toRadians(distance);
    center[region].push(kilometers);
    let km = Math.round(kilometers);
    let mi = Math.round(kilometers / 1.60934);
    let name = center[region][2];
    regions.push({name, km, mi, region});
    if (distance < closest) {
      closest = distance;
      site = region;
    }
  }

  return site;
}

const toRadians = (n) => n * Math.PI / 180;
const toDegrees = (n) => n / Math.PI * 180;
const haversineAngularDistance = ([lat1, lng1], [lat2, lng2]) => {
  var φ1 = toRadians(lat1);
  var φ2 = toRadians(lat2);
  var Δφ = toRadians(lat2 - lat1);
  var Δλ = toRadians(lng2 - lng1);

  var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  return toDegrees(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// eventPropGetter: (event, start, end, isSelected) => {className, style}
let eventPropGetter = (event, start, end, isSelected) => {
  let no = (places.indexOf(event.in) + places.length) % places.length;
  return { style: { backgroundColor: colour[no], color: '#000' } };
};

// Promise<{ site:string, regions: Array<Object>, events: Array<Object> }>
let narrowToClosestSite = ({coords}) => {
  let site = getClosestSite(coords);
  let events = haievents.filter((event) => event.in === site);

  regions = regions.sort((a, b) => a.km - b.km);
  return Promise.resolve({ site, regions, events });
};

let tryGeoLocatingMe = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
    else {
      reject('geolocation not supported');
    }
  });
}

export default {
  narrowToClosestSite,
  tryGeoLocatingMe,
  colourBySite: eventPropGetter,
  haversineAngularDistance,
  getClosestSite,
  getRegions
};
