import ContactForm from '../components/ContactForm';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
  const [cardsRef, cardsVisible] = useScrollAnimation();
  const [mapRef, mapVisible] = useScrollAnimation();
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-3xl text-accent" />,
      title: 'Office Address',
      content: '123 Real Estate Avenue, Makati City, Philippines 1200'
    },
    {
      icon: <FaPhone className="text-3xl text-accent" />,
      title: 'Phone Number',
      content: '+63 912 345 6789',
      link: 'tel:+639123456789'
    },
    {
      icon: <FaEnvelope className="text-3xl text-accent" />,
      title: 'Email Address',
      content: 'info@streamrockrealty.com',
      link: 'mailto:info@streamrockrealty.com'
    },
    {
      icon: <FaClock className="text-3xl text-accent" />,
      title: 'Business Hours',
      content: 'Monday - Saturday: 9:00 AM - 6:00 PM'
    }
  ];

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-200">We're here to help you find your dream property</p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="section-padding bg-light">
        <div className="container-custom">
          <div ref={cardsRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 stagger-children ${cardsVisible ? 'visible' : ''}`}>
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">{info.icon}</div>
                <h3 className="text-lg font-semibold text-primary mb-2">{info.title}</h3>
                {info.link ? (
                  <a 
                    href={info.link}
                    className="text-gray-600 hover:text-accent transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{info.content}</p>
                )}
              </div>
            ))}
          </div>

          {/* Map and Social Media */}
          <div ref={mapRef} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 scroll-fade-up ${mapVisible ? 'visible' : ''}`}>
            {/* Map */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4037268!2d121.0234!3d14.5547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90264a0c8d9%3A0x4d7f48d2c5e7!2sMakati%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>

            {/* Social Media & Additional Info */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">Connect With Us</h3>
              <p className="text-gray-600 mb-6">
                Follow us on social media for the latest property listings, real estate tips, 
                and exclusive promotions.
              </p>
              
              <div className="flex space-x-4 mb-8">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-primary mb-3">Schedule a Visit</h4>
                <p className="text-gray-600 mb-4">
                  Want to see a property in person? Contact us to schedule a viewing at your convenience.
                </p>
                <a href="tel:+639123456789" className="btn-primary inline-block">
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
};

export default Contact;
