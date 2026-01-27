import { FaCheckCircle, FaUsers, FaAward, FaHandshake } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const [statsRef, statsVisible] = useScrollAnimation();
  const [contentRef, contentVisible] = useScrollAnimation();
  const [valuesRef, valuesVisible] = useScrollAnimation();
  const stats = [
    { number: '500+', label: 'Properties Sold' },
    { number: '1000+', label: 'Happy Clients' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Awards Won' }
  ];

  const values = [
    {
      icon: <FaCheckCircle className="text-4xl text-accent" />,
      title: 'Quality Assurance',
      description: 'We ensure all properties meet the highest standards of quality and compliance'
    },
    {
      icon: <FaUsers className="text-4xl text-accent" />,
      title: 'Client-Focused',
      description: 'Your satisfaction and success are at the heart of everything we do'
    },
    {
      icon: <FaAward className="text-4xl text-accent" />,
      title: 'Industry Excellence',
      description: 'Award-winning service recognized by leading real estate organizations'
    },
    {
      icon: <FaHandshake className="text-4xl text-accent" />,
      title: 'Trusted Partnership',
      description: 'Building long-term relationships based on trust and transparency'
    }
  ];

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=80)'
      }}>
        <div className="absolute inset-0 bg-primary bg-opacity-80"></div>
        <div className="relative h-full flex items-center">
          <div className="container-custom text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Why Streamrock Realty?</h1>
            <p className="text-xl max-w-2xl">Your trusted partner in finding the perfect property investment</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-light py-16">
        <div className="container-custom">
          <div ref={statsRef} className={`grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children ${statsVisible ? 'visible' : ''}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="section-padding bg-white">
        <div className="container-custom">
          <div ref={contentRef} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-fade-up ${contentVisible ? 'visible' : ''}`}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Your Real Estate Success Starts Here
              </h2>
              <p className="text-gray-600 mb-6">
                Streamrock Realty Corporation has been a trusted name in Philippine real estate for over 15 years. 
                We specialize in premium properties across Nuvali, Vermosa, Southmont, and the beautiful beaches 
                of Batangas.
              </p>
              <p className="text-gray-600 mb-6">
                Our mission is to help individuals and families find their dream homes while providing investors 
                with lucrative opportunities in the booming real estate market. With our extensive network, 
                market expertise, and commitment to excellence, we ensure every transaction is smooth and successful.
              </p>
              <p className="text-gray-600 mb-6">
                Whether you're a first-time homebuyer, looking to upgrade, or seeking investment properties, 
                our team of experienced professionals is here to guide you every step of the way.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                alt="About Us"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="section-padding bg-light">
        <div className="container-custom">
          <div className="text-center mb-16 scroll-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide us in delivering exceptional real estate services
            </p>
          </div>

          <div ref={valuesRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children ${valuesVisible ? 'visible' : ''}`}>
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Let's make your real estate dreams a reality
          </p>
          <a href="/contact" className="btn-secondary inline-block">
            Contact Us Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
