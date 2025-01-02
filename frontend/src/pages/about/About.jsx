import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import "./about.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="grid-background">
        <div className="grid-foreground">
          <motion.div 
            className="contact-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="glow-effect"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.h1 
                className="title"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Get in Touch
                <div className="title-gradient"></div>
              </motion.h1>

              <div className="cards-container">
                <motion.div 
                  className="contact-card"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="card-content">
                    <div className="icon-wrapper">
                      <Mail className="icon" />
                      <div className="icon-glow"></div>
                    </div>
                    <h3>Email Us</h3>
                    <p className="gradient-text">hello@elearning.com</p>
                    <div className="card-border"></div>
                  </div>
                </motion.div>

                <motion.div 
                  className="contact-card"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="card-content">
                    <div className="icon-wrapper">
                      <Phone className="icon" />
                      <div className="icon-glow"></div>
                    </div>
                    <h3>Call Us</h3>
                    <p className="gradient-text">+1 (555) 123-4567</p>
                    <div className="card-border"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
