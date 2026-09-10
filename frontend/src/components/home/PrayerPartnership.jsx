// src/components/home/PrayerPartnership.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MessageSquare, Gift, ChevronRight } from 'lucide-react';

function PrayerPartnership() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50/50 via-white to-red-50/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-church-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-church-gold/10 px-4 py-2 rounded-full border border-church-gold/20 mb-4">
              <span className="text-church-gold text-lg">🙏</span>
              <span className="text-church-gold text-xs font-bold uppercase tracking-wider">Prayer & Partnership</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-4">
              We Are Here to <br />
              <span className="text-church-gold">Pray With You</span>
            </h2>
            <div className="w-20 h-1 bg-church-gold rounded-full mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-6">
              At Generals of Grace, we believe in the power of prayer. Whatever you're going through,
              our prayer team is ready to stand with you in faith.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-church-navy">Submit a Prayer Request</h4>
                  <p className="text-sm text-gray-500">Share your burden with us. We'll pray with you.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-church-navy">Become a Partner</h4>
                  <p className="text-sm text-gray-500">Join our mission to reach the world with the Gospel.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-church-gold/10 rounded-full flex items-center justify-center text-church-gold flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-church-navy">Need Counseling?</h4>
                  <p className="text-sm text-gray-500">Our pastoral team is here to support you.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="bg-church-gold text-church-navy px-8 py-3.5 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-church-gold/30 inline-flex items-center gap-2">
                Submit Prayer Request
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/give" className="border-2 border-church-gold/30 text-church-navy px-8 py-3.5 rounded-xl font-semibold hover:bg-church-gold/5 transition-all inline-flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Partner With Us
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/prayer.jpg"
                alt="Prayer at Generals of Grace"
                className="w-full h-[400px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544717298-f3b15b7c7e3b?w=600&h=500&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-church-navy/80 to-transparent"></div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-xs border-l-4 border-church-gold">
              <p className="text-gray-700 text-sm italic leading-relaxed">
                "The effective, fervent prayer of a righteous man avails much."
              </p>
              <p className="text-church-gold font-semibold text-sm mt-2">James 5:16</p>
            </div>

            <div className="absolute -top-4 -right-4 bg-church-gold text-church-navy p-4 rounded-xl shadow-xl text-center">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs font-medium">Prayer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PrayerPartnership;