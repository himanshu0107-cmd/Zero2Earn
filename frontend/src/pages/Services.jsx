import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, Filter, ArrowDownWideNarrow, MapPin, Search } from 'lucide-react';

const Services = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(category || 'all');

  const services = [
    { id: 1, title: 'I will build a React frontend for your final year project', seller: 'alex_dev', category: 'coding', rating: 4.9, reviews: 34, price: 1500, img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', hostel: 'Block A' },
    { id: 2, title: 'I will create stunning PowerPoint presentations', seller: 'sarah_designs', category: 'design', rating: 4.8, reviews: 120, price: 500, img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', hostel: 'Girls Hostel' },
    { id: 3, title: 'I will debug your C++ or Java data structures code', seller: 'code_ninja', category: 'coding', rating: 5.0, reviews: 45, price: 300, img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', hostel: 'Block C' },
    { id: 4, title: 'I will tutor you in Engineering Mathematics', seller: 'math_genius', category: 'tutoring', rating: 4.7, reviews: 89, price: 400, img: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', hostel: 'Block A' },
    { id: 5, title: 'I will edit your college fest vlogs perfectly', seller: 'video_pro', category: 'editing', rating: 4.9, reviews: 20, price: 800, img: 'https://images.unsplash.com/photo-1574717024453-354056afd6bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', hostel: 'Block B' },
    { id: 6, title: 'I will fix your broken laptop or install OS', seller: 'tech_support', category: 'tech', rating: 4.6, reviews: 66, price: 200, img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', hostel: 'Block D' }
  ];

  const filteredServices = services.filter(service => {
    let match = true;
    if (activeTab !== 'all' && service.category !== activeTab) match = false;
    if (search && !service.title.toLowerCase().includes(search.toLowerCase())) match = false;
    return match;
  });

  return (
    <div>
      <Navbar isLoggedIn={false} />
      
      <div className="container" style={{ padding: '40px 24px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
          {search ? `Results for "${search}"` : 'Explore Campus Services'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Find the right student talent to help you out.</p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {['all', 'coding', 'design', 'tutoring', 'editing', 'tech'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontWeight: '600',
                border: activeTab === cat ? 'none' : '1px solid #e4e5e7',
                backgroundColor: activeTab === cat ? 'var(--text-main)' : 'white',
                color: activeTab === cat ? 'white' : 'var(--text-main)'
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}><Filter size={16} /> Filters</button>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}>Budget</button>
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}>Delivery Time</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sort by</span>
            <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>Relevance <ArrowDownWideNarrow size={16} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '12px', background: 'rgba(29, 191, 115, 0.1)', borderRadius: '8px', color: '#1DBf73' }}>
          <div style={{ background: '#1DBf73', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>AI Tip</div>
          <span>Based on your activity, we recommend looking at <strong style={{ cursor: 'pointer', textDecoration: 'underline' }}>Coding</strong> services.</span>
        </div>

        {filteredServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '20px', color: 'var(--text-main)' }}>No services found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map(service => (
              <div key={service.id} className="service-card" onClick={() => navigate(`/services/${service.id}`)} style={{ cursor: 'pointer' }}>
                <img src={service.img} alt={service.title} className="service-image" />
                <div className="service-content">
                  <div className="seller-info" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="seller-avatar" style={{ backgroundImage: `url(https://i.pravatar.cc/100?u=${service.seller})`, backgroundSize: 'cover' }}></div>
                      <span className="seller-name">{service.seller}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {service.hostel}
                    </span>
                  </div>
                  <h3 className="service-title" style={{ height: '48px' }}>{service.title}</h3>
                  <div className="service-rating">
                    <Star size={16} fill="currentColor" /> {service.rating} <span>({service.reviews})</span>
                  </div>
                </div>
                <div className="service-footer" style={{ padding: '16px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Starting at</div>
                  <div className="service-price">Rs {service.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
