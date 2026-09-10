// src/components/home/SoulWinningCTA.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Gift, Flame } from 'lucide-react';

function SoulWinningCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-church-navy via-church-navy/95 to-church-gold/90 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #FFD700 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="absolute -top-40 -right-40 w-80 h-80 bg-church-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-church-gold/5 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/20">
            <Flame className="w-5 h-5 text-yellow-400" />
            The Harvest is Plentiful
            <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span>
            <span className="text-yellow-300">Matthew 9:37</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            Win Souls and <br />
            <span className="text-church-gold">Receive Rewards</span>
          </h2>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every soul you win brings eternal rewards and unlocks God's abundant blessings in your life.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/soul-winning" className="bg-church-gold text-church-navy px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:shadow-2xl hover:shadow-church-gold/30 inline-flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5" />
              Join Soul Winning
            </Link>
            <Link to="/give" className="border-2 border-white/50 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all hover:border-white inline-flex items-center gap-2 text-lg">
              <Gift className="w-5 h-5" />
              Give Online
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-white/40">
            <span>✦ Faith</span>
            <span className="w-px h-4 bg-white/20"></span>
            <span>✦ Hope</span>
            <span className="w-px h-4 bg-white/20"></span>
            <span>✦ Love</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SoulWinningCTA;