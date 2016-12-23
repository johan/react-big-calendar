import React from 'react';
import BigCalendar from 'react-big-calendar';
//import events from '../events';
import hai from './hai';

let haievents = [];

let selectable, Selectable = React.createClass({
  render() {
    selectable = this;
    return (
      <div {...this.props}>
        <h3 className="callout">
          Click an event to see more info, or
          drag the mouse over the calendar to select a date/time range.
        </h3>
        <BigCalendar
          selectable
          events={window.haievents = haievents}
          eventPropGetter={hai.colourBySite}
          defaultView='week'
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2016, 11, 1)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={(slotInfo) => alert(
            `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
            `\nend: ${slotInfo.end.toLocaleString()}`
          )}
        />
      </div>
    )
  }
});

let gotPosition = window.pos = (position) => {
  debugger;
  hai.narrowToClosestSite(position).then(({ site, regions, events }) => {
    debugger;
    regions.forEach(({ region, name, km, mi }) => {
      console.log(`${km}km / ${mi}mi to ${region}/${name}`);
    });
    window.events = haievents = events.filter((event) => event.in === site);
    if (selectable) {
      selectable.render();
    }
    else console.error('no calendar?!');
  });
};

debugger;
hai.tryGeoLocatingMe().then(gotPosition).catch((e) => {
  debugger;
  console.info('geolocation api failed; reason:', e.message);
  gotPosition({
    coords: { latitude: 37.4, longitude: -122.1 }
  });
})

export default Selectable;
