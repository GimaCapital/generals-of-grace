// src/components/home/GeneralCTA.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Users, MessageSquare, Star } from 'lucide-react';

function GeneralCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-church-gold/10 via-white to-church-gold/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-church-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-church-navy/5 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-church-navy/5 backdrop-blur-sm px-6 py-2.5 rounded-full text-sm font-medium text-church-navy mb-6 border border-church-navy/10">
            <Crown className="w-4 h-4 text-church-gold" />
            Your Calling Awaits
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-church-navy mb-6 leading-tight">
            Ready to Be a <br />
            <span className="gradient-text">General of Grace?</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join us in our mission to raise generals of grace and impact the world for Christ.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-church-navy text-white px-10 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:shadow-2xl hover:shadow-church-navy/30 inline-flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              Join Our Church
            </Link>
            <Link to="/contact" className="border-2 border-church-navy/30 text-church-navy px-10 py-4 rounded-lg font-semibold hover:bg-church-navy/5 transition-all hover:border-church-navy inline-flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5" />
              Contact Us
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                ))}
              </div>
              <span className="text-church-navy font-semibold">5,000+</span>
              <span className="text-gray-400">members worldwide</span>
            </div>
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-2 text-church-navy">
              <Star className="w-4 h-4 text-church-gold fill-church-gold" />
              <span className="font-semibold">4.9</span>
              <span className="text-gray-400">rating</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .gradient-text {
          background: linear-gradient(135deg, #C9A84C, #F5D76E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}

export default GeneralCTA;