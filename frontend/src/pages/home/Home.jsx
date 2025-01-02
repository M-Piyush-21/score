import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Video, Star, CheckCircle, Laptop, Play, ChevronRight, Award, Clock } from 'lucide-react';
import './home.css';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of experience",
      stats: "50+ Expert Instructors"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Live Sessions",
      description: "Interactive live classes with real-time doubt solving",
      stats: "100+ Live Sessions Monthly"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Learning",
      description: "Join a community of passionate learners",
      stats: "10,000+ Active Students"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Developer",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "This platform transformed my career. The courses are incredibly well-structured and practical."
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      text: "The live sessions and community support made learning complex topics much easier."
    },
    {
      name: "Emma Davis",
      role: "UX Designer",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      text: "The quality of instruction and course materials is outstanding. Highly recommended!"
    }
  ];

  const stats = [
    { value: "50K+", label: "Students" },
    { value: "100+", label: "Courses" },
    { value: "95%", label: "Success Rate" },
    { value: "4.9", label: "Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full filter blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full filter blur-[100px] opacity-20"></div>
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your Future with Expert Learning
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Access world-class education and unlock your potential with our comprehensive courses
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                to="/courses" 
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 flex items-center transform hover:scale-105"
              >
                Explore Courses
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="group px-8 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 flex items-center transform hover:scale-105"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/30 relative overflow-hidden">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose Our Platform
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-500/50 transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <div className="flex items-center text-purple-400 group-hover:text-purple-300">
                  <span>{feature.stats}</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center text-white mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What Our Students Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">{testimonial.text}</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div 
          className="container mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning on our platform
          </p>
          <Link 
            to="/register" 
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 p-4 rounded-lg max-w-4xl w-full relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                Close
              </button>
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <Play className="w-16 h-16 text-white/50" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
