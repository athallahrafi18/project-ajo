import { motion } from 'framer-motion';
import { Coffee, Clock, MapPin, Phone, Heart, Users, Clock as TimeIcon, Facebook, Instagram, Twitter, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const storyCards = [
    {
      icon: <Coffee className="w-12 h-12 text-primary-600" />,
      title: 'Quality First',
      description: 'We source only the finest beans from sustainable farms worldwide, ensuring every cup meets our exacting standards.'
    },
    {
      icon: <Heart className="w-12 h-12 text-primary-600" />,
      title: 'Community Focus',
      description: "More than just a café, we're a gathering place where connections are made and community thrives."
    },
    {
      icon: <Users className="w-12 h-12 text-primary-600" />,
      title: 'Expert Team',
      description: 'Our skilled baristas are passionate about coffee and dedicated to creating the perfect cup just for you.'
    },
    {
      icon: <TimeIcon className="w-12 h-12 text-primary-600" />,
      title: 'Consistency',
      description: "Whether it's your first visit or your hundredth, expect the same high-quality experience every time."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80"
            alt="Café interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6"
          >
            Welcome to Oōmi Lezato
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white mb-8"
          >
            Your perfect coffee experience awaits
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/menu"
              className="bg-primary-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-primary-700 transition-colors"
            >
              View Our Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-secondary-900 mb-6">Our Story</h2>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Founded in 2020, Potte Housé began with a simple mission: to serve exceptional coffee in a warm, welcoming environment. What started as a small corner café has grown into a beloved community hub, where quality meets comfort.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {storyCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-start">
                  <div className="mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-3">
                    {card.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-serif font-bold text-secondary-900 mb-4">Customer Reviews</h2>
            <p className="text-lg text-secondary-600">What our customers say about us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex text-primary-600 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-600 mb-4">
                  "Amazing coffee and atmosphere! The staff is incredibly friendly and knowledgeable. This has become my go-to spot for both work and relaxation."
                </p>
                <div className="font-medium text-secondary-900">- Ajo Kalempong</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-secondary-900 mb-8">Contact Us</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-secondary-700">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Business Hours</h3>
                <div className="flex items-center text-secondary-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Mon-Fri: 7am - 8pm<br />Sat-Sun: 8am - 9pm</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Location</h3>
                <div className="flex items-center text-secondary-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Jl. Abdul Hakim No.2<br />Padang Bulan Selayang I, Kec. Medan Selayang, Kota Medan, Sumatera Utara 20131</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Contact</h3>
                <div className="flex items-center text-secondary-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>(555) 123-4567</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-secondary-600 hover:text-primary-600">
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-secondary-600 hover:text-primary-600">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-secondary-600 hover:text-primary-600">
                    <Twitter className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;