import { useMemo, useState } from 'react';
import {
  ArrowDownUp, ArrowRight, Bike, CarFront, Check, ChevronDown, Clock3,
  Compass, CreditCard, MapPin, Menu, Navigation, ShieldCheck, Sparkles,
  Star, Users, Wallet, X, Zap
} from 'lucide-react';

const vehicles = [
  { id: 'bike', name: 'Bike', detail: 'Quick solo rides', capacity: '1', rate: 9, base: 18, time: '2 min', icon: Bike, tag: 'Budget pick' },
  { id: 'auto', name: 'Auto', detail: 'Easy city travel', capacity: '3', rate: 14, base: 28, time: '3 min', icon: Compass, tag: '' },
  { id: 'mini', name: 'Mini', detail: 'Compact & comfy', capacity: '4', rate: 17, base: 45, time: '4 min', icon: CarFront, tag: 'Popular' },
  { id: 'sedan', name: 'Sedan', detail: 'Extra comfort', capacity: '4', rate: 22, base: 65, time: '5 min', icon: CarFront, tag: '' },
  { id: 'suv', name: 'SUV', detail: 'Room for everyone', capacity: '6', rate: 29, base: 90, time: '7 min', icon: CarFront, tag: '' }
];

const money = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(amount);

const defaultBookings = () => {
  try { return JSON.parse(localStorage.getItem('rideleaf-bookings') || '[]'); }
  catch { return []; }
};

export default function App() {
  const [pickup, setPickup] = useState('Vishnu Institute of Technology');
  const [destination, setDestination] = useState('Bhimavaram Railway Station');
  const [distance, setDistance] = useState(12);
  const [selected, setSelected] = useState('mini');
  const [rideType, setRideType] = useState('now');
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookings, setBookings] = useState(defaultBookings);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selected) || vehicles[2];
  const fare = useMemo(() => Math.round(selectedVehicle.base + distance * selectedVehicle.rate), [selectedVehicle, distance]);

  function swapLocations() {
    setPickup(destination);
    setDestination(pickup);
  }

  function bookRide(event) {
    event.preventDefault();
    if (!pickup.trim() || !destination.trim()) {
      setError('Please enter both pickup and destination locations.');
      return;
    }
    if (pickup.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError('Pickup and destination should be different.');
      return;
    }
    const booking = {
      id: 'RL' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      pickup: pickup.trim(),
      destination: destination.trim(),
      vehicle: selectedVehicle.name,
      distance,
      fare,
      rideType,
      createdAt: new Date().toLocaleString()
    };
    const next = [booking, ...bookings].slice(0, 8);
    setBookings(next);
    localStorage.setItem('rideleaf-bookings', JSON.stringify(next));
    setConfirmation(booking);
    setError('');
  }

  function removeBooking(id) {
    const next = bookings.filter((booking) => booking.id !== id);
    setBookings(next);
    localStorage.setItem('rideleaf-bookings', JSON.stringify(next));
  }

  function clearBookings() {
    setBookings([]);
    localStorage.removeItem('rideleaf-bookings');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="RideLeaf home">
          <span className="brand-mark"><Navigation size={21} fill="currentColor" /></span>
          <span>ride<span className="brand-light">leaf</span><small>MOVE WITH EASE</small></span>
        </a>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
          <a href="#book" onClick={() => setMenuOpen(false)}>Book a ride</a>
          <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#history" onClick={() => setMenuOpen(false)}>My bookings</a>
        </nav>
        <a className="nav-cta" href="#book">Get a ride <ArrowRight size={16} /></a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CITY. YOUR RIDE.</div>
            <h1>Every journey<br />starts with <em>you.</em></h1>
            <p className="hero-text">A better way to get there. Choose your ride, see your fare upfront, and get moving in minutes.</p>
            <div className="hero-actions">
              <a href="#book" className="button button-light">Book your ride <ArrowRight size={17} /></a>
              <div className="trust-note"><span className="avatar-stack"><i>R</i><i>A</i><i>S</i></span><span><b>Made for everyday travel</b><small>Simple. Clear. Convenient.</small></span></div>
            </div>
            <div className="hero-stats">
              <div><strong>5</strong><span>Ride options</span></div>
              <div><strong>₹9/km</strong><span>Starting fare</span></div>
              <div><strong>24/7</strong><span>Ride planning</span></div>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration of a car on a road">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="sun-disc"><Sparkles size={24} /></div>
            <div className="road"><span /><span /><span /></div>
            <div className="art-pin pin-a"><MapPin size={20} fill="currentColor" /></div>
            <div className="art-pin pin-b"><MapPin size={20} fill="currentColor" /></div>
            <div className="car-illustration">
              <div className="car-window" /><div className="car-body" /><div className="car-front" />
              <div className="wheel wheel-left" /><div className="wheel wheel-right" />
              <div className="car-light" />
            </div>
            <div className="floating-card"><span className="float-icon"><ShieldCheck size={19} /></span><span><b>Your ride, your choice</b><small>Fare shown before booking</small></span><Check size={17} className="float-check" /></div>
            <div className="art-caption">LESS WAITING. MORE LIVING.</div>
          </div>
          <div className="hero-bottom-label"><span>01</span> EVERYDAY MOBILITY, REIMAGINED <span className="label-line" /></div>
        </section>

        <section className="booking-section" id="book">
          <div className="section-intro">
            <span className="section-kicker">LET'S GET YOU THERE</span>
            <h2>Where are you <em>heading?</em></h2>
            <p>Set your route and find the right ride for your day.</p>
          </div>
          <div className="booking-layout">
            <form className="booking-card" onSubmit={bookRide}>
              <div className="card-heading"><div><span className="step-label">01 / YOUR ROUTE</span><h3>Plan your trip</h3></div><span className="card-icon"><MapPin size={19} /></span></div>
              <div className="route-fields">
                <div className="route-track"><span className="track-dot pickup-dot" /><span className="track-dash" /><span className="track-dot destination-dot" /></div>
                <label className="location-field"><span>Pickup location</span><input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter pickup point" /><small> <MapPin size={13} /> Your starting point</small></label>
                <button className="swap-button" type="button" onClick={swapLocations} aria-label="Swap pickup and destination"><ArrowDownUp size={17} /></button>
                <label className="location-field"><span>Drop-off location</span><input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Where to?" /><small><Navigation size={13} /> Your destination</small></label>
              </div>
              <div className="distance-control">
                <div className="distance-title"><span>Estimated distance</span><strong>{distance} <small>km</small></strong></div>
                <input aria-label="Estimated distance in kilometres" type="range" min="1" max="40" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
                <div className="range-labels"><span>1 km</span><span>40 km</span></div>
              </div>
              <div className="ride-timing"><span className="timing-label">When do you need a ride?</span><div className="timing-options"><button type="button" className={rideType === 'now' ? 'timing-option active' : 'timing-option'} onClick={() => setRideType('now')}><Zap size={15} /> Ride now</button><button type="button" className={rideType === 'later' ? 'timing-option active' : 'timing-option'} onClick={() => setRideType('later')}><Clock3 size={15} /> Plan for later</button></div></div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="button button-primary submit-button" type="submit">Find my ride <ArrowRight size={17} /></button>
              <p className="form-footnote"><ShieldCheck size={14} /> Transparent estimates. No surprise pricing.</p>
            </form>

            <div className="vehicle-panel">
              <div className="vehicle-heading"><div><span className="step-label">02 / PICK YOUR RIDE</span><h3>Choose your comfort</h3></div><span className="vehicle-count">05 OPTIONS</span></div>
              <div className="vehicle-list">
                {vehicles.map((vehicle) => {
                  const Icon = vehicle.icon;
                  const isSelected = selected === vehicle.id;
                  const estimated = Math.round(vehicle.base + distance * vehicle.rate);
                  return <button type="button" key={vehicle.id} className={isSelected ? 'vehicle-option vehicle-selected' : 'vehicle-option'} onClick={() => setSelected(vehicle.id)} aria-pressed={isSelected}>
                    <span className={'vehicle-icon ' + vehicle.id}><Icon size={25} strokeWidth={1.7} /></span>
                    <span className="vehicle-info"><span className="vehicle-name">{vehicle.name}{vehicle.tag && <i className={vehicle.tag === 'Popular' ? 'tag tag-popular' : 'tag'}>{vehicle.tag}</i>}</span><span className="vehicle-detail"><Users size={12} /> {vehicle.capacity} {vehicle.capacity === '1' ? 'rider' : 'seats'} <span>·</span> <Clock3 size={12} /> {vehicle.time} away</span><span className="vehicle-description">{vehicle.detail}</span></span>
                    <span className="vehicle-price">{money(estimated)}<small>est. fare</small></span>
                    <span className="radio-indicator">{isSelected && <Check size={13} />}</span>
                  </button>;
                })}
              </div>
              <div className="fare-summary">
                <div className="fare-top"><span><Wallet size={17} /> Estimated total</span><span className="fare-value">{money(fare)}</span></div>
                <div className="fare-breakdown"><span>{selectedVehicle.name} · {distance} km</span><span>Base {money(selectedVehicle.base)} + distance {money(distance * selectedVehicle.rate)}</span></div>
                <div className="fare-disclaimer">Demo estimate only. Final prices may vary in a real service.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="how-section" id="how">
          <div className="how-heading"><span className="section-kicker">NO FUSS, JUST GO</span><h2>Three steps. <em>One smooth ride.</em></h2></div>
          <div className="steps-grid">
            <article className="step-card"><span className="step-number">01</span><div className="step-illustration route-step"><MapPin size={26} /><span className="step-route-line" /><Navigation size={25} /></div><h3>Set your destination</h3><p>Tell us where you're starting and where you need to go.</p></article>
            <article className="step-card"><span className="step-number">02</span><div className="step-illustration car-step"><CarFront size={34} /><span className="sparkle-one">✳</span></div><h3>Choose your ride</h3><p>Compare ride types and estimated fares before you decide.</p></article>
            <article className="step-card"><span className="step-number">03</span><div className="step-illustration go-step"><Check size={30} /><span className="go-arrow"><ArrowRight size={22} /></span></div><h3>You're good to go</h3><p>Confirm your demo booking and keep track of it below.</p></article>
          </div>
        </section>

        <section className="history-section" id="history">
          <div className="history-heading"><div><span className="section-kicker">YOUR TRAVEL DESK</span><h2>Recent <em>bookings.</em></h2><p>Your demo ride confirmations stay saved on this device.</p></div>{bookings.length > 0 && <button className="clear-button" onClick={clearBookings}>Clear history</button>}</div>
          {bookings.length === 0 ? <div className="empty-state"><span><Clock3 size={24} /></span><h3>No rides just yet</h3><p>Your confirmed demo bookings will appear here.</p><a href="#book">Plan your first ride <ArrowRight size={15} /></a></div> : <div className="history-list">{bookings.map((booking) => <article className="history-item" key={booking.id}><div className="history-car"><CarFront size={22} /></div><div className="history-route"><strong>{booking.pickup}</strong><span><i />{booking.destination}</span><small>{booking.createdAt} · {booking.id}</small></div><div className="history-meta"><b>{money(booking.fare)}</b><span>{booking.vehicle} · {booking.distance} km</span><small>{booking.rideType === 'later' ? 'Planned ride' : 'Ride now'}</small></div><button className="remove-booking" onClick={() => removeBooking(booking.id)} aria-label={'Remove booking ' + booking.id}><X size={16} /></button></article>)}</div>}
        </section>

        <section className="promise-strip"><div className="promise-icon"><ShieldCheck size={25} /></div><div><span className="section-kicker">BUILT AROUND YOUR DAY</span><h2>Good rides make <em>good days.</em></h2><p>Clear estimates, easy choices, and a smoother way to plan the everyday.</p></div><a href="#book" className="button button-light">Plan a ride <ArrowRight size={16} /></a></section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Navigation size={18} fill="currentColor" /></span><span>ride<span className="brand-light">leaf</span><small>MOVE WITH EASE</small></span></a><p>A college project prototype · Not a real taxi service</p><div className="footer-right"><span><Star size={13} fill="currentColor" /> Designed for everyday journeys</span><a href="#home">Back to top ↑</a></div></footer>

      {confirmation && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setConfirmation(null); }}><section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><button className="modal-close" onClick={() => setConfirmation(null)} aria-label="Close confirmation"><X size={19} /></button><div className="success-icon"><Check size={31} /></div><span className="section-kicker">BOOKING CONFIRMED · DEMO</span><h2 id="confirmation-title">You're all <em>set!</em></h2><p className="confirmation-copy">Your sample ride has been added to your booking history.</p><div className="confirmation-code"><span>BOOKING REFERENCE</span><strong>{confirmation.id}</strong></div><div className="confirmation-route"><div><MapPin size={16} /><span><small>PICKUP</small><b>{confirmation.pickup}</b></span></div><div><Navigation size={16} /><span><small>DROP-OFF</small><b>{confirmation.destination}</b></span></div></div><div className="confirmation-total"><span>{confirmation.vehicle} · {confirmation.distance} km</span><strong>{money(confirmation.fare)}</strong></div><p className="demo-notice"><ShieldCheck size={15} /> This is a website demo. No driver or payment was contacted.</p><button className="button button-primary submit-button" onClick={() => { setConfirmation(null); document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' }); }}>View my bookings <ArrowRight size={17} /></button></section></div>}
    </div>
  );
}