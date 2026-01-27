import { FaBuilding, FaHandshake, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Features = () => {
  const [titleRef, titleVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation();
  const features = [
    {
      icon: <FaBuilding className="text-4xl text-accent" />,
      title: 'Premium Properties',
      description: 'Carefully curated selection of high-quality properties in prime locations'
    },
    {
      icon: <FaHandshake className="text-4xl text-accent" />,
      title: 'Trusted Service',
      description: 'Professional guidance and support throughout your property journey'
    },
    {
      icon: <FaChartLine className="text-4xl text-accent" />,
      title: 'Investment Growth',
      description: 'Properties with excellent potential for long-term value appreciation'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-accent" />,
      title: 'Secure Transactions',
      description: 'Transparent and secure property transactions with legal compliance'
    }
  ];

  return (
    <section className="section-padding bg-light">
      <div className="container-custom">
        <div ref={titleRef} className={`text-center mb-16 scroll-fade-up ${titleVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose Streamrock</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive real estate solutions backed by years of expertise and commitment to excellence
          </p>
        </div>

        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children ${gridVisible ? 'visible' : ''}`}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
