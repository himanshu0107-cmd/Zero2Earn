import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, Clock, RefreshCw, Check, MapPin, Zap } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock service data based on ID
  const service = {
    id: id,
    title: 'I will build a React frontend for your final year project',
    seller: 'alex_dev',
    rating: 4.9,
    reviews: 34,
    price: 1500,
    img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: `Need a stunning frontend for your final year project but stuck with backend code? I've got you covered!
    
I specialize in React and Tailwind CSS and can build clean, responsive, and modern UIs quickly. Whether it's a dashboard, e-commerce, or a portfolio site, I ensure top quality.

What you'll get:
- Fully responsive design
- Clean, readable code
- Component-based architecture
- Integration with your APIs
- Unlimited revisions until you're satisfied

Let me handle the UI so you can focus on making your project passing the review!`,
    delivery: '3 Days Delivery',
    revisions: 'Unlimited Revisions',
    hostel: 'Block A, Room 312',
    features: ['Responsive Design', 'Source Code', 'Setup Instruction']
  };

  return (
    <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Navbar isLoggedIn={true} userRole="buyer" />
      
      <div className="container" style={{ padding: '40px 24px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 600px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>{service.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="seller-avatar" style={{ backgroundImage: `url(https://i.pravatar.cc/100?u=${service.seller})`, backgroundSize: 'cover' }}></div>
              <span style={{ fontWeight: '600' }}>{service.seller}</span>
            </div>
            <div style={{ color: '#ffb33e', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <Star size={16} fill="currentColor" /> {service.rating} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>({service.reviews} reviews)</span>
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={16} /> Campus: {service.hostel}
            </div>
          </div>

          <img src={service.img} alt={service.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '32px' }} />

          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>About this service</h2>
          <div style={{ whiteSpace: 'pre-line', color: 'var(--text-main)', lineHeight: '1.6', fontSize: '16px', marginBottom: '32px' }}>
            {service.description}
          </div>

          <div style={{ background: '#f0f0f0', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#1DBf73' }}>
              <Zap size={18} /> AI Suggestion
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Based on similar services on campus, Rs {service.price} is a highly competitive price. We suggest booking fast as this seller's schedule fills up by midterms.
            </p>
          </div>
        </div>

        <div style={{ width: '350px' }}>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px' }}>Final Project Package</h2>
              <span style={{ fontSize: '24px', fontWeight: '700' }}>Rs {service.price}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Complete 5-page frontend with responsive design and basic API integration support.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', fontWeight: '600', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {service.delivery}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={16} /> {service.revisions}</div>
            </div>

            <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
              {service.features.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-main)' }}>
                  <Check size={16} color="#1DBf73" /> {feature}
                </li>
              ))}
            </ul>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px', fontSize: '16px', marginBottom: '12px' }}
              onClick={() => alert('Order Placed Successfully! Deducted Rs ' + service.price + ' from your mock wallet.')}
            >
              Continue to Book
            </button>
            <button className="btn btn-outline" style={{ width: '100%', padding: '16px', fontSize: '16px' }}>Message Seller</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
