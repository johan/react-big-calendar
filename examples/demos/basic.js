import React, { PropTypes } from 'react';
import BigCalendar from 'react-big-calendar';
import events from '../events';
import hai from './hai';

let calendar;
let featured;

let Basic = React.createClass({
  render() {
    calendar = window.calendar = this;
    if (!featured) return null;
    console.log('rendering', featured);
    return (
      <BigCalendar
        {...this.props}
        eventPropGetter={hai.colourBySite}
        events={featured}
        defaultDate={events[0].start}
      />
    );
  }
})

window.hai = hai;

let gotPosition = window.pos = (position) => {
  hai.narrowToClosestSite(position).then(({ site, regions, events }) => {
    regions.forEach(({ region, name, km, mi }) => {
      console.log(`${km}km / ${mi}mi to ${region}/${name}`);
    });
    window.events = featured = events.filter((event) => event.in === site);
    if (calendar) {
      console.log('rerendering', featured.length);
      calendar.render(featured);
    }
    else console.error('no calendar?!');
  });
};

hai.tryGeoLocatingMe().then(gotPosition).catch((e) => {
  console.info('geolocation api failed; reason:', e.message);
  gotPosition({
    coords: { latitude: 37.4, longitude: -122.1 }
  });
})

export default Basic;
