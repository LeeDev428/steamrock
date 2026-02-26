import BookingForm from '../components/BookingForm';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
  const [cardsRef, cardsVisible] = useScrollAnimation();
  const [mapRef, mapVisible] = useScrollAnimation();
  const [formRef, formVisible] = useScrollAnimation();
  
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-3xl text-accent" />,
      title: 'Office Address',
      content: 'Blk 8 Lot 3 Iris St., Camella Homes I, Brgy. Putatan, Muntinlupa City 1770'
    },
    {
      icon: <FaPhone className="text-3xl text-accent" />,
      title: 'Phone Number',
      content: '+63 908 885 6169',
      link: 'tel:+639088856169'
    },
    {
      icon: <FaEnvelope className="text-3xl text-accent" />,
      title: 'Email Address',
      content: 'dwllaneta@gmail.com',
      link: 'mailto:dwllaneta@gmail.com'
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.803019063658!2d121.0419!3d14.4180!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d1a3f826f54b%3A0x2e2d79eb1a2afb4e!2sPutatan%2C%20Muntinlupa%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1741000000000"
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
                  href="https://www.facebook.com/streamrockrealty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
                <a 
                  href="https://instagram.com/streamrock_realty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a 
                  href="https://wa.me/639088856169" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <FaWhatsapp size={24} />
                </a>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-primary mb-3">Schedule a Visit</h4>
                <p className="text-gray-600 mb-4">
                  Want to see a property in person? Fill out our booking form below to schedule a viewing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div ref={formRef} className={`max-w-3xl mx-auto scroll-fade-up ${formVisible ? 'visible' : ''}`}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-4">Schedule a Property Viewing</h2>
              <p className="text-gray-600">
                Fill out the form below to book a viewing appointment. Our team will contact you to confirm your schedule.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
