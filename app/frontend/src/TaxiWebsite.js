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

  const pad = (n) => (n < 10 ? '0' + n : '' + n);

  const setTimeFromOffset = (minutes) => {
    const now = new Date();
    const target = new Date(now.getTime() + minutes * 60000);
    const hh = pad(target.getHours());
    const mm = pad(target.getMinutes());
    setFormData(prev => ({ ...prev, time: `${hh}:${mm}` }));
  };

  const handleTimeSelectChange = (e) => {
    const value = e.target.value;
    setTimeSelect(value);
    if (value !== 'custom') {
      setTimeFromOffset(parseInt(value, 10));
    }
  };

  const handleSubmit = async (e) => {
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
            <div className="nav-call-icon" aria-hidden="true">
              📞
            </div>
          </a>
        </div>
      </header>

      <main id="top">
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
                <div className="chip">
                  <div className="chip-icon">⏱️</div>
                  <span>Fast response times</span>
                </div>
                <div className="chip">
                  <div className="chip-icon">🧾</div>
                  <span>Upfront, flat rates available</span>
                </div>
                <div className="chip">
                  <div className="chip-icon">🛡️</div>
                  <span>Professional, licensed drivers</span>
                </div>
              </div>

              <div className="hero-actions">
                <a className="btn-primary" href="tel:+14165668154">
                  Call now &nbsp;•&nbsp; (416) 566-8154
                </a>
                <a className="btn-secondary" href="#contact">
                  Book online
                  <span aria-hidden="true">→</span>
                </a>
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
                    <div className="wheel">
                      <div className="wheel-inner"></div>
                    </div>
                    <div className="wheel">
                      <div className="wheel-inner"></div>
                    </div>
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
              <div className="card">
                <div className="card-icon">🏙️</div>
                <h3>Local & City Trips</h3>
                <p>
                  Safe, punctual rides within Markham and the Greater Toronto Area for errands,
                  appointments, and everyday travel.
                </p>
                <small>Point-to-point rides • Flexible routes</small>
              </div>

              <div className="card">
                <div className="card-icon">✈️</div>
                <h3>Airport Transfers</h3>
                <p>
                  Pre-booked rides to and from Pearson, Billy Bishop, and other nearby airports. We
                  track timing so you arrive stress-free.
                </p>
                <small>Ideal for early morning & late-night flights</small>
              </div>

              <div className="card">
                <div className="card-icon">👨‍👩‍👧</div>
                <h3>Family & Group Rides</h3>
                <p>
                  Comfortable vehicles for small groups, families, and students. Extra luggage? Let
                  us know when you book.
                </p>
                <small>Child seats available on request</small>
              </div>

              <div className="card">
                <div className="card-icon">🕒</div>
                <h3>24/7 Service</h3>
                <p>
                  Day or night, weekend or weekday—Markham Taxi is available whenever you need a
                  ride.
                </p>
                <small>Late-night pickups • Early morning commutes</small>
              </div>

              <div className="card">
                <div className="card-icon">💼</div>
                <h3>Corporate & Regular Clients</h3>
                <p>
                  Reliable transport for staff, clients, and recurring trips. Ask about repeat
                  bookings and invoicing.
                </p>
                <small>Business-friendly, dependable service</small>
              </div>

              <div className="card">
                <div className="card-icon">🧾</div>
                <h3>Flat Rate Options</h3>
                <p>
                  For common routes like airport runs, flat rates can be arranged in advance so your
                  fare is clear before you ride.
                </p>
                <small>Call to confirm available flat routes</small>
              </div>
            </div>
          </div>
        </section>

        <section id="fleet">
          <div className="container two-column">
            <div>
              <div className="section-header">
                <div className="section-eyebrow">Our fleet</div>
                <h2 className="section-title">
                  Clean, comfortable, and well-maintained vehicles.
                </h2>
                <p className="section-description">
                  Every Markham Taxi vehicle is regularly inspected and kept tidy for your comfort.
                  From solo riders to small groups, we match the car to your trip.
                </p>
              </div>

              <ul className="info-list">
                <li>
                  <span className="info-label">Sedans</span>
                  <span>Ideal for 1–3 passengers with light luggage. Perfect for everyday trips.</span>
                </li>
                <li>
                  <span className="info-label">Larger vehicles</span>
                  <span>Roomier options for families, small groups, or extra bags when available.</span>
                </li>
                <li>
                  <span className="info-label">Cleanliness</span>
                  <span>
                    Non-smoking vehicles, regularly cleaned interiors, and courteous drivers.
                  </span>
                </li>
                <li>
                  <span className="info-label">Safety</span>
                  <span>Licensed, experienced drivers who know Markham and the GTA well.</span>
                </li>
              </ul>

              <div id="rates" className="pill">
                <span className="pill-dot"></span>
                <span>
                  <strong>Rates:</strong> Metered fares & flat rates for popular routes. Call to
                  confirm.
                </span>
              </div>
            </div>

            <div id="contact" className="booking-card" aria-label="Online booking form">
              <h3>Request a booking</h3>
              <p>
                Prefer to send details instead of calling? Fill out this form and we'll confirm your
                ride by phone or text. For urgent trips, please call directly.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="inline-fields">
                  <div className="field">
                    <label htmlFor="phone">Phone number</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g. (416) 555-1234"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <p className="helper-text">We'll use this to confirm your ride.</p>
                  </div>
                  <div className="field">
                    <label htmlFor="date">Pickup date</label>
                    <input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="date-display"
                    />
                  </div>
                </div>

                <div className="inline-fields">
                  <div className="field">
                    <label htmlFor="time-select">Pickup time</label>
                    <div className="time-row">
                      <select
                        id="time-select"
                        className="time-select"
                        value={timeSelect}
                        onChange={handleTimeSelectChange}
                      >
                        <option value="0">Now</option>
                        <option value="10">10 min</option>
                        <option value="15">15 min</option>
                        <option value="20">20 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">1 hr</option>
                        <option value="custom">Custom…</option>
                      </select>
                      <input
                        id="time"
                        type="time"
                        required
                        className="time-input"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        readOnly={timeSelect !== 'custom'}
                      />
                    </div>
                    <p className="helper-text">Choose a quick offset or pick a custom time.</p>
                  </div>
                  <div className="field">
                    <label htmlFor="passengers">Passengers</label>
                    <select
                      id="passengers"
                      value={formData.passengers}
                      onChange={(e) =>
                        setFormData({ ...formData, passengers: e.target.value })
                      }
                    >
                      <option value="1">1 passenger</option>
                      <option value="2">2 passengers</option>
                      <option value="3">3 passengers</option>
                      <option value="4">4 passengers</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="pickup">Pickup address</label>
                  <input
                    id="pickup"
                    type="text"
                    placeholder="Street address, city"
                    required
                    value={formData.pickup}
                    onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="dropoff">Drop-off address</label>
                  <input
                    id="dropoff"
                    type="text"
                    placeholder="Street address, city"
                    required
                    value={formData.dropoff}
                    onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label htmlFor="notes">Notes (optional)</label>
                  <textarea
                    id="notes"
                    placeholder="Flight number, gate, buzzer, special requests…"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-submit">
                  Send booking request
                  <span aria-hidden="true">→</span>
                </button>

                {formMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    style={{
                      marginTop: '0.6rem',
                      fontSize: '0.92rem',
                      color: formMessage.includes('✓') ? 'green' : 'var(--muted)'
                    }}
                  >
                    {formMessage}
                  </div>
                )}

                <p className="form-note">
                  For immediate pickups, please call
                  <strong>
                    <a href="tel:+14165668154"> (416) 566-8154</a>
                  </strong>
                  .
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <span>Markham Taxi</span>
            <span>•</span>
            <span>Serving Markham & GTA</span>
          </div>
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
