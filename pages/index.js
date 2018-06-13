import App from 'grommet/components/App';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Select from 'grommet/components/Select';
import Label from 'grommet/components/Label';
import Search from 'grommet/components/Search';
import Paragraph from 'grommet/components/Paragraph';
import Tile from 'grommet/components/Tile';
import Tiles from 'grommet/components/Tiles';
import Footer from 'grommet/components/Footer';
import Split from 'grommet/components/Split';
import FilterIcon from 'grommet/components/icons/base/Filter';
import CloseIcon from 'grommet/components/icons/base/Close';
import EditIcon from 'grommet/components/icons/base/Edit';
import BrandGrommetOutlineIcon from 'grommet/components/icons/base/BrandGrommetOutline';

const airlines = [
  'Aegean Airlines',
  'Aer Lingus',
  'Aeroflot',
  'Wizzair',
  'WOW air',
  'Xiamen Airlines',
];

const departingCities = [
  'Los Angeles',
  'Sacramento',
  'San Diego',
  'San Francisco',
  'San Jose',
  'Oakland',
];

const departingTimes = [
  '10:00 am',
  '11:00 am',
  '3:00 pm',
  '4:00 pm'
];

const arrivingCities = [
  'Belo Horizonte',
  'Rio de Janeiro',
  'Salvador',
  'Sao Paulo',
];

const arrivingTimes = [
  '7:00 am +1',
  '8:40 am +1',
  '4:00 pm +1',
  '7:00 pm +1'
];

const priceRangeOptions = [
  '$0 - $500',
  '$501 - $999',
  '$1000 - $1999',
  '$2000+',
];

const flights = [];

function populateRandomFlights() {
  for(let i = 0; i < 1000; i++) {
    // random airline
    const randomAirlineIndex = Math.floor(Math.random() * airlines.length);
    const randomAirline = airlines[randomAirlineIndex];
    
    // random departing city
    const randomDepartingIndex = Math.floor(Math.random() * departingCities.length);
    const randomDepartingCity = departingCities[randomDepartingIndex];
    
    // random departing time
    const randomDepartingTimeIndex = Math.floor(Math.random() * departingTimes.length);
    const randomDepartingTime = departingTimes[randomDepartingTimeIndex];
    
    // random arriving city
    const randomArrivingIndex = Math.floor(Math.random() * arrivingCities.length);
    const randomArrivingCity = arrivingCities[randomArrivingIndex];
    
    // random arriving time
    const randomArrivingTimeIndex = Math.floor(Math.random() * arrivingTimes.length);
    const randomArrivingTime = arrivingTimes[randomArrivingTimeIndex];
    
    flights.push({
      number: Math.floor(Math.random() * 1000) + 1,
      price: Math.floor(Math.random() * 1701) + 300,
      airline: randomAirline,
      from: randomDepartingCity,
      depart: randomDepartingTime,
      arrive: randomArrivingTime,
      to: randomArrivingCity,
    });
  }  
}

populateRandomFlights();

class Flights extends React.Component {
  constructor() {
    super();
    this.state = {
      currentFlights: flights,
      filters: {
        airlines: undefined,
        priceRange: 'All',
      },
      showFilter: true,
      searchText: '',
      start: 0,
    };
  }
  
  getFlightsByFilter(flights) {
    const { filters: { priceRange }} = this.state;
    let lowestPrice = 9999999;
    let highestPrice = 0;
    if (priceRange !== 'All') {
      priceRange.forEach((price) => {
        const priceGroup = price.split(' - ');
        const fromPrice = priceGroup[0].replace(/[^0-9]/gi,'');
        const toPrice = priceGroup.length > 1 ? priceGroup[1].replace(/[^0-9]/gi,'') : undefined ;
        if (fromPrice < lowestPrice) {
          lowestPrice = fromPrice;
        }        
        if (toPrice && toPrice > highestPrice) {
          highestPrice = toPrice;
        }
      })
    }
    if (!highestPrice) {
      highestPrice = 9999999;  
    }
    return flights.filter(flight => (
      (priceRange !== 'All' && flight.price >= lowestPrice && flight.price <= highestPrice)
    ));
  }
  
  getFlightsBySearch() {
    const { searchText } = this.state;
    const cleanSearch = searchText.replace(/[^a-z0-9 ]/gi,'').toLowerCase();
    return flights.filter(flight => (
      flight.number.toString().toLowerCase().indexOf(cleanSearch) >= 0 ||
      flight.price.toString().toLowerCase().indexOf(cleanSearch) >= 0 ||
      flight.airline.toLowerCase().indexOf(cleanSearch) >= 0 ||
      flight.from.toLowerCase().indexOf(cleanSearch) >= 0 ||
      flight.to.toLowerCase().indexOf(cleanSearch) >= 0 ||
      flight.arrive.toLowerCase().indexOf(cleanSearch) >= 0 ||
      flight.depart.toLowerCase().indexOf(cleanSearch) >= 0
    ));    
  }

  filterFlights() {
    const { searchText, filters: { priceRange } } = this.state;
    
    let currentFlights = flights;
    if (searchText !== '') {
      currentFlights = this.getFlightsBySearch();
    }
    
    if (priceRange !== 'All') {
      currentFlights = this.getFlightsByFilter(currentFlights);
    }
 
    this.setState({
      currentFlights,
      start: 0,
    });
  }
  
  renderFilter() {
    const { filters: { priceRange }} = this.state;
    return (
      <Sidebar colorIndex='light-2'>
        <Header pad={{ horizontal: 'medium' }} justify='between'>
          <Title>Filter</Title>
          <Button
            icon={<CloseIcon />}
            onClick={() => this.setState({ showFilter: false })}
          />
        </Header>
        <Box pad={{ horizontal: 'medium', vertical: 'medium', between: 'medium' }} flex={false}>
          <div>
          <Heading tag='h3'>Price Range</Heading>
          <Select
            multiple={true}
            inline={true}
            options={['All'].concat(priceRangeOptions)}
            value={priceRange}
            onChange={(event) => {
              const newFilters = { ...this.state.filters };
              newFilters.priceRange = event.value;
              if (
                event.option === 'All' ||
                !event.value.length ||
                event.value.length === priceRangeOptions.length
              ) {
                newFilters.priceRange = 'All';
              } else if (event.value[0] === 'All') {
                newFilters.priceRange.shift();         
              }
              this.setState({ filters: newFilters }, this.filterFlights);
            }}
           />
          </div>
          <div>
          <Heading tag='h3'>Airlines</Heading>
          <Box
            justify='between'
            align='center'
            direction='row'
            responsive={false}
           >
            <Label margin='none'>All airports</Label>
            <Button icon={<EditIcon />} onClick={() => this.setState({ showAirportsFilter: true })} />
          </Box>
          </div>
        </Box>
      </Sidebar>
    );  
  }

  renderFlights() {
    const { currentFlights, start } = this.state;
 
    const flightsNode = currentFlights.slice(0, start || 50).map((flight, index) => (
      <Tile
        key={`${flight.number}-${index}`}
        separator='all'
        basis='medium'
        pad={{ vertical: 'medium', horizontal: 'medium', between: 'small' }}
      >
        <Heading tag='h3' strong={true} align='center' margin='none'>
          {flight.from} - {flight.to}
        </Heading>
        <Heading tag='h4' align='center' margin='none'>
          Leaves at {flight.depart}, Arrives at {flight.arrive}
        </Heading>
        <Heading tag='h4' align='center' margin='none'>
          ${flight.price}
        </Heading>
        <Paragraph margin='none' align='center'>
          {flight.airline} #{flight.number}
        </Paragraph>
      </Tile>
    ));
    
    let onMore;
    if (start < currentFlights.length) {
      onMore = () => this.setState({ start: this.state.start + 50 });
    }
    
    return (
      <Tiles
        flush={false}
        justify='center'
        pad={{ between: 'medium' }}
        onMore={onMore}
       >
        {flightsNode}
      </Tiles>
    );
  }
  
  renderFlightsLabel() {
    const { currentFlights, start } = this.state;
    const count = currentFlights.length;
    const currentCount = start || 50;
    let countLabel;
    switch (count) {
      case 0:
        countLabel = 'No flights';
        break;
      case 1:
        countLabel = 'One flight';
        break;
      default:
        countLabel = `${count} flights`;
    } 
    return (
      <span>{countLabel} {count > currentCount ? `(showing ${currentCount})` : undefined}</span>
    );
  }
 
  renderDashboard() {
    const { currentFlights, searchText, start } = this.state;
    return (
      <Box full={{ vertical: true, responsive: false}}>
        <Header colorIndex='brand' pad={{ horizontal: 'small', between: 'small' }} justify='between'>
          <Box direction='row' responsive={false} align='center' pad={{ between: 'small' }}>
            <BrandGrommetOutlineIcon size='large' />
            <Heading margin='none' tag='h4' strong={true}>FlightsFinder</Heading>
          </Box>
          <Search
            placeholder='Search'
            inline={true}  
            fill={true}
            value={searchText}
            onDOMChange={(event) => this.setState({ searchText: event.target.value }, this.filterFlights)}
          />
        </Header>
        <Box flex={true}>
          <Box flex={false}>  
            {this.renderFlights()}
          </Box>
        </Box>
        <Footer separator='top' pad='small'>
          <Box flex={true} align='center'>
            {this.renderFlightsLabel()}
          </Box>
          <Button
            a11yTitle='Open Flight Filter'
            icon={<FilterIcon colorIndex='brand' />}
            onClick={() => this.setState({ showFilter: !this.state.showFilter })}
          />
        </Footer>
      </Box>
    );
  }

  render() {
    const { showFilter } = this.state;
    
    let filterNode = <div />
    if (showFilter) {
      filterNode = this.renderFilter();   
    }
    const dashboardNode = this.renderDashboard();
    return (
      <Split flex='left' priority={showFilter ? 'right' : 'left'} fixed={true}>
        {dashboardNode}
        {filterNode}
      </Split>
    );
  }
}

export default class Index extends React.Component {
  render() {
    return (
      <App centered={false}>
        <Flights />
      </App>
    );
  }
}