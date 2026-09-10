// src/components/home/PastorsMessage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

function PastorsMessage() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Quote className="w-8 h-8 text-church-gold" />
              <span className="text-church-gold font-semibold text-sm uppercase tracking-wider">Pastor's Heart</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy mb-4">
              The Heart of <span className="text-church-gold">Soul Winning</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-church-gold to-amber-400 rounded-full mb-6"></div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                "Soul winning is not just an assignment—it's the heartbeat of God. Every soul matters to Him, and
                every soul you win is a treasure stored in heaven."
              </p>
              <p className="text-gray-600 leading-relaxed">— Pastor Andrew Osalor</p>
            </div>

            <div className="mt-6 p-6 bg-church-gold/10 rounded-xl border-l-4 border-church-gold">
              <p className="text-gray-700 italic leading-relaxed">
                "The greatest joy in ministry is seeing a soul come to Christ. It's the reward that surpasses
                all earthly treasures."
              </p>
              <p className="text-sm text-church-gold font-semibold mt-2">— Pastor Andrew Osalor</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="/images/aday.jpg"
              alt="Pastor Andrew Osalor"
              className="rounded-2xl shadow-2xl w-full h-[450px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-church-gold text-white p-6 rounded-xl shadow-xl max-w-xs">
              <p className="font-display text-lg font-bold">"Every Soul Counts"</p>
              <p className="text-sm opacity-90">Pastor Andrew Osalor</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default PastorsMessage;