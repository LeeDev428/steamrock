import { FaBuilding, FaHandshake, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const Features = () => {
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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Why Choose Streamrock</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive real estate solutions backed by years of expertise and commitment to excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
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
