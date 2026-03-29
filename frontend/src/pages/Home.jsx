import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, Star, MessageSquare, Zap, Target } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${searchQuery}`);
    }
  };

  return (
    <div>
      <Navbar isLoggedIn={false} />
      
      <section className="hero">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '56px', lineHeight: '1.1' }}>
            Find the perfect <span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#1DBf73' }}>campus freelance</span> services for your needs
          </h1>
          <p style={{ marginTop: '20px', marginBottom: '32px', color: '#e0e0e0' }}>
            Get help with coding, design, assignments, or daily campus tasks from talented students around you.
          </p>
          
          <form className="search-bar" onSubmit={handleSearch} style={{ maxWidth: '100%', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', color: '#62646a' }}>
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="What service are you looking for today?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '18px' }}
            />
            <button type="submit" style={{ fontSize: '18px', padding: '0 32px' }}>Search</button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '600' }}>Popular:</span>
            <button className="btn btn-outline" style={{ borderRadius: '20px', padding: '4px 16px', borderColor: 'white', color: 'white' }} onClick={() => navigate('/services?category=coding')}>CS Projects</button>
            <button className="btn btn-outline" style={{ borderRadius: '20px', padding: '4px 16px', borderColor: 'white', color: 'white' }} onClick={() => navigate('/services?category=design')}>Presentation Design</button>
            <button className="btn btn-outline" style={{ borderRadius: '20px', padding: '4px 16px', borderColor: 'white', color: 'white' }} onClick={() => navigate('/services?category=tutoring')}>Math Tutoring</button>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#fafafa', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', marginBottom: '40px', color: 'var(--text-main)' }}>A whole world of campus talent at your fingertips</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            <div>
              <div style={{ marginBottom: '16px', color: 'var(--text-main)' }}><Target size={40} /></div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>The best for every budget</h3>
              <p style={{ color: 'var(--text-muted)' }}>Find high-quality services at every price point. No hourly rates, just project-based pricing tailored to student budgets.</p>
            </div>
            <div>
              <div style={{ marginBottom: '16px', color: 'var(--text-main)' }}><Zap size={40} /></div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Quick delivery from campus mates</h3>
              <p style={{ color: 'var(--text-muted)' }}>Need a project done fast? Find freelancers right on your campus who understand your deadlines perfectly.</p>
            </div>
            <div>
              <div style={{ marginBottom: '16px', color: 'var(--text-main)' }}><MessageSquare size={40} /></div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>AI-Powered Matching</h3>
              <p style={{ color: 'var(--text-muted)' }}>Our smart AI finds the perfect student freelancer for your specific requested tasks and skills instantly.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container" style={{ padding: '80px 24px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '32px' }}>Trending Services on Campus</h2>
        <div className="services-grid">
          {[
            { id: 1, title: 'I will build a React frontend for your final year project', seller: 'alex_dev', rating: 4.9, reviews: 34, price: 'Rs 1500', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
            { id: 2, title: 'I will create stunning PowerPoint presentations', seller: 'sarah_designs', rating: 4.8, reviews: 120, price: 'Rs 500', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
            { id: 3, title: 'I will debug your C++ or Java data structures code', seller: 'code_ninja', rating: 5.0, reviews: 45, price: 'Rs 300', img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
            { id: 4, title: 'I will tutor you in Engineering Mathematics', seller: 'math_genius', rating: 4.7, reviews: 89, price: 'Rs 400', img: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
          ].map(service => (
            <div key={service.id} className="service-card" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: 'pointer' }}>
              <img src={service.img} alt={service.title} className="service-image" />
              <div className="service-content">
                <div className="seller-info">
                  <div className="seller-avatar" style={{ backgroundImage: `url(https://i.pravatar.cc/100?u=${service.seller})`, backgroundSize: 'cover' }}></div>
                  <span className="seller-name">{service.seller}</span>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <div className="service-rating">
                  <Star size={16} fill="currentColor" /> {service.rating} <span>({service.reviews})</span>
                </div>
              </div>
              <div className="service-footer" style={{ padding: '16px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Starting at</div>
                <div className="service-price">{service.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
