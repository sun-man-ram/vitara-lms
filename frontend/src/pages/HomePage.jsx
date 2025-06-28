import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const toggleAccordion = (e) => {
  const header = e.currentTarget;
  const accordion = header.parentElement;
  const isOpen = accordion.classList.contains('open');

  document.querySelectorAll('.accordion').forEach(acc => {
    acc.classList.remove('open');
    acc.querySelector('.accordion-header span').textContent = '+';
  });

  if (!isOpen) {
    accordion.classList.add('open');
    header.querySelector('span').textContent = '−';
  }
};

const HomePage = () => {
  return (
    <>
      <Header />

      <section className="hero">
        <h1>Welcome to Vitaran Learning</h1>
        <p>Your trusted Learning Management System to empower education and training.</p>
      </section>

      <section className="combined-section" id="about">
        <div className="about-header">
          <h2>About Us</h2>
        </div>
        <div className="about">
          <div>
            <h2>About Us</h2>
            <p>Vitaran Learning is a leading provider of innovative e-learning solutions. Our commitment to excellence and passion for education drive us to create a learning experience that goes beyond traditional boundaries. We understand that education is not one-size-fits-all, so we can deliver the content that caters to diverse learning styles and preferences.</p>
          </div>
          <div>
            <h2>Our Vision</h2>
            <p>At the heart of Vitaran Learning is a vision for the future of education. We envision a world where learning is a lifelong pursuit, accessible to all, and driven by curiosity and collaboration. Our team is dedicated to staying at the forefront of educational technology, ensuring that our learners are equipped with the skills they need to thrive in a rapidly changing world.</p>
          </div>
        </div>

        <h2>What Sets Us Apart</h2>
        <div className="features">
          <div>
            <h3>Innovative Learning Solutions</h3>
            <p>We leverage cutting-edge technology to create interactive and immersive learning experiences. From virtual classrooms to gamified assessments, our solutions are designed to captivate and inspire.</p>
          </div>
          <div>
            <h3>Expert Educators</h3>
            <p>Our team of experienced educators and industry professionals brings a wealth of knowledge to the table. We believe in the power of mentorship and strive to connect learners with the best minds in their respective fields.</p>
          </div>
          <div>
            <h3>Customized Learning</h3>
            <p>Recognizing that every learner is unique, we offer customizable learning solutions that adapt to individual needs and organizations. Whether it is traditional publishing services, e-learning solutions with cutting-edge technology for K–12 students, educators, or an organization seeking to upskill your workforce.</p>
          </div>
        </div>

        <div className="accordion-layout">
          <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
            <img src="https://img.freepik.com/free-photo/business-woman-working-laptop_53876-20635.jpg" alt="Learning" style={{ width: '100%', borderRadius: '12px' }} />
          </div>
          <div style={{ flex: '2 1 500px' }}>
            {['Teachers', 'Students', 'Schools'].map(section => (
              <div className="accordion" key={section}>
                <div className="accordion-header" onClick={toggleAccordion}>{section} <span>+</span></div>
                <div className="accordion-content">
                  <ul>
                    {section === 'Teachers' && (
                      <>
                        <li>Detailed Lesson Plans</li>
                        <li>Comprehensive Question Banks</li>
                        <li>Reports and Analytics</li>
                        <li>Workshops and Training</li>
                      </>
                    )}
                    {section === 'Students' && (
                      <>
                        <li>Interactive modules</li>
                        <li>Assessments</li>
                        <li>Progress tracking</li>
                      </>
                    )}
                    {section === 'Schools' && (
                      <>
                        <li>Performance reports</li>
                        <li>Curriculum alignment</li>
                        <li>Admin dashboards</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-us-section">
        <h2>Contact Us</h2>
        <div className="contact-us-container">
          <div className="contact-us-text">
            <p>Thank you for considering us for your family's educational needs...</p>
            <h3>Registered Office</h3>
            <p>841, K P H B Phase 2, Kukatpally, Hyderabad...</p>
            <p>Email: support@vitaranlearning.com</p>
            <p>Phone: +91 8074563902</p>
            <h3>Branch Office</h3>
            <p>204, Newton Homes, Hadapsar, Pune, Maharashtra - 411028</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
