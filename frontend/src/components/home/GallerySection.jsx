// src/components/home/GallerySection.jsx
import React from 'react';

function GallerySection() {
  const images = [
    { src: 'images/waship.jpg', alt: 'Worship Service', label: 'Worship Service' },
    { src: 'images/pastor_pray_for_blink_person.jpg', alt: 'Pastor Ministering Healing', label: 'Pastor Ministering Healing' },
    { src: 'images/congregation.jpg', alt: 'Congregation Worship', label: 'Congregation Worship' },
    { src: 'images/pastor_need_down.jpg', alt: 'Prayer & Worship', label: 'Prayer & Worship' },
    { src: 'images/pastor_demostraste.jpg', alt: 'Demonstrating God\'s Power', label: 'Demonstrating God\'s Power' },
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-church-gold/30 to-transparent"></div>

      <div className="container-custom">
        <div className="text-end mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-church-navy">
            From Our <span className="text-church-gold">Gallery</span>
          </h2>
          <div className="w-20 h-1 bg-church-gold rounded-full mt-3 ms-auto"></div>
          <p className="text-gray-500 mt-3 max-w-2xl ms-auto">
            Capturing moments of worship, fellowship, and God's goodness in our community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-semibold">{image.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://web.facebook.com/gogintlchurch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-church-navy to-church-navy/90 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-church-navy/30 transition-all duration-300 hover:-translate-y-1"
          >
            <span>View More Photos</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default GallerySection;