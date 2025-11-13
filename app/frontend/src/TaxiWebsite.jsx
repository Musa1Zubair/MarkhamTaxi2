import React, { useState, useEffect } from 'react';
import './TaxiWebsite.css';

const TaxiWebsite = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    passengers: '1',
    pickup: '',
    dropoff: '',
    notes: ''
  });
  const [formMessage, setFormMessage] = useState('');
  const [timeSelect, setTimeSelect] = useState('15');

  useEffect(() => {
    const now = new Date();
    const tzOffsetMs = now.getTimezoneOffset() * 60000;
    const localISODate = new Date(now - tzOffsetMs).toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: localISODate }));
    setTimeFromOffset(15);
  }, []);

  const pad = n => (n < 10 ? '0' + n : '' + n);

  const setTimeFromOffset = minutes => {
    const now = new Date();
    const target = new Date(now.getTime() + minutes * 60000);
    const hh = pad(target.getHours());
    const mm = pad(target.getMinutes());
    setFormData(prev => ({ ...prev, time: `${hh}:${mm}` }));
  };

  const handleTimeSelectChange = e => {
    const value = e.target.value;
    setTimeSelect(value);
    if (value !== 'custom') {
      setTimeFromOffset(parseInt(value, 10));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormMessage('Sending booking request…');

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

    try {
      const res = await fetch(`${backendUrl}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormMessage('✓ Request sent — we will confirm by phone or text shortly.');
        setFormData({
          name: '',
          phone: '',
          date: formData.date,
          time: formData.time,
          passengers: '1',
          pickup: '',
          dropoff: '',
          notes: ''
        });
      } else {
        setFormMessage(
          data.message || 'Failed to send booking request — please try again or call (416) 566-8154.'
        );
      }
    } catch (err) {
      console.error('Booking error:', err);
      setFormMessage('Network error. Please try again or call (416) 566-8154.');
    }
  };

  return (
    <div className="taxi-website">
      <header>
        <div className="container nav">
          <a href="#top" className="brand">
            <div className="brand-logo" aria-hidden="true">
              <span>MT</span>
            </div>
            <div className="brand-text">
              <div className="title">Markham Taxi</div>
              <div className="subtitle">Fast • Safe • Local</div>
            </div>
          </a>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#fleet">Fleet</a>
            <a href="#rates">Rates</a>
            <a href="#contact">Contact</a>
          </nav>

          <a className="nav-call" href="tel:+14165668154">
            <div>
              <small>Book a ride</small>
              <br />
              <strong>(416) 566-8154</strong>
            </div>
            <div className="nav-call-icon" aria-hidden="true">📞</div>
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot"></span>
                <span>Open 24/7 • Markham & GTA</span>
              </div>
              <h1>
                Your <span className="highlight">reliable ride</span>
                <br />
                in and around Markham.
              </h1>
              <p className="hero-lead">
                Markham Taxi offers safe, on-time pickups for local trips, airport transfers, and
                anywhere in the Greater Toronto Area. One call and your car is on the way.
              </p>

              <div className="hero-badges">
                <div className="chip"><div className="chip-icon">⏱️</div><span>Fast response times</span></div>
                <div className="chip"><div className="chip-icon">🧾</div><span>Upfront, flat rates available</span></div>
                <div className="chip"><div className="chip-icon">🛡️</div><span>Professional, licensed drivers</span></div>
              </div>

              <div className="hero-actions">
                <a className="btn-primary" href="tel:+14165668154">Call now &nbsp;•&nbsp; (416) 566-8154</a>
                <a className="btn-secondary" href="#contact">Book online <span aria-hidden="true">→</span></a>
              </div>

              <p className="hero-meta">
                <strong>Serving:</strong> Markham • Richmond Hill • Scarborough • North York • GTA
              </p>
            </div>

            <div className="hero-card" aria-label="Markham Taxi booking preview">
              <div className="hero-card-header">
                <div>
                  <div className="hero-card-title">Next taxi in minutes</div>
                  <small>Typical pickup time within Markham</small>
                </div>
                <span className="hero-card-tag">On-duty • 24/7</span>
              </div>

              <div className="taxi-graphic" aria-hidden="true">
                <div className="taxi-car">
                  <div className="taxi-top">TAXI</div>
                  <div className="taxi-body">
                    <div className="taxi-window"></div>
                    <div className="taxi-checker"></div>
                  </div>
                  <div className="taxi-wheels">
                    <div className="wheel"><div className="wheel-inner"></div></div>
                    <div className="wheel"><div className="wheel-inner"></div></div>
                  </div>
                </div>
                <div className="road"></div>
              </div>

              <div className="hero-card-footer">
                <div>
                  <strong>Call to confirm your fare</strong>
                  <br />
                  <small>Estimate provided by the dispatcher based on your trip.</small>
                </div>
                <div>
                  <small>Booking line</small>
                  <br />
                  <strong>(416) 566-8154</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">Our services</div>
              <h2 className="section-title">More than just a ride across town.</h2>
              <p className="section-description">
                Whether it's a quick trip to the grocery store, a ride to work, or a late-night
                pickup, Markham Taxi is here to help you get where you need to go—comfortably and on
                time.
              </p>
            </div>

            <div className="services-grid">
              {/* Cards */}
              <div className="card"><div className="card-icon">🏙️</div><h3>Local & City Trips</h3><p>Safe, punctual rides within Markham and the GTA.</p></div>
              <div className="card"><div className="card-icon">✈️</div><h3>Airport Transfers</h3><p>Pre-booked rides to and from airports.</p></div>
              <div className="card"><div className="card-icon">👨‍👩‍👧</div><h3>Family & Group Rides</h3><p>Comfortable vehicles for small groups and families.</p></div>
              <div className="card"><div className="card-icon">🕒</div><h3>24/7 Service</h3><p>Available whenever you need a ride.</p></div>
              <div className="card"><div className="card-icon">💼</div><h3>Corporate & Regular Clients</h3><p>Reliable transport for staff, clients, and recurring trips.</p></div>
              <div className="card"><div className="card-icon">🧾</div><h3>Flat Rate Options</h3><p>Flat rates available for common routes.</p></div>
            </div>
          </div>
        </section>

        {/* Fleet & Booking */}
        <section id="fleet">
          <div className="container two-column">
            <div>
              <div className="section-header">
                <div className="section-eyebrow">Our fleet</div>
                <h2 className="section-title">Clean, comfortable, and well-maintained vehicles.</h2>
                <p className="section-description">
                  Every Markham Taxi vehicle is regularly inspected and kept tidy for your comfort.
                </p>
              </div>
            </div>

            <div id="contact" className="booking-card" aria-label="Online booking form">
              <h3>Request a booking</h3>
              <p>Prefer to send details instead of calling? Fill out this form and we'll confirm your ride.</p>
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                {/* Phone */}
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                {/* Date */}
                <div className="field">
                  <label htmlFor="date">Date</label>
                  <input id="date" type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                </div>
                {/* Time */}
                <div className="field">
                  <label htmlFor="time">Time</label>
                  <div className="time-row">
                    <select value={timeSelect} onChange={handleTimeSelectChange}>
                      <option value="0">Now</option>
                      <option value="10">10 min</option>
                      <option value="15">15 min</option>
                      <option value="20">20 min</option>
                      <option value="30">30 min</option>
                      <option value="custom">Custom…</option>
                    </select>
                    <input type="time" value={formData.time} readOnly={timeSelect !== 'custom'} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                  </div>
                </div>
                {/* Pickup & Dropoff */}
                <div className="field">
                  <label htmlFor="pickup">Pickup</label>
                  <input id="pickup" type="text" required value={formData.pickup} onChange={e => setFormData({ ...formData, pickup: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="dropoff">Drop-off</label>
                  <input id="dropoff" type="text" required value={formData.dropoff} onChange={e => setFormData({ ...formData, dropoff: e.target.value })} />
                </div>
                {/* Notes */}
                <div className="field">
                  <label htmlFor="notes">Notes</label>
                  <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}></textarea>
                </div>

                <button type="submit" className="btn-submit">Send booking request →</button>

                {formMessage && <div className="form-message">{formMessage}</div>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">Markham Taxi • Serving Markham & GTA</div>
          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#fleet">Fleet</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-call">
            <span>Book your next ride:&nbsp;</span>
            <a href="tel:+14165668154">(416) 566-8154</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TaxiWebsite;
