import React from 'react';

const logos = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg',
    alt: 'Emblem of India',
  },
  {
    src: 'https://thumbs.dreamstime.com/b/logo-icon-vector-logos-icons-set-social-media-flat-banner-vectors-svg-eps-jpg-jpeg-paper-texture-glossy-emblem-wallpaper-210441921.jpg',
    alt: 'Social Media Vector Logos',
  },
];

const LogoShowcase = () => {
  return (
    <div className="bg-background pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <img
          src={logos[0].src}
          alt={logos[0].alt}
          className="block max-w-[140px] h-auto bg-white p-2 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
        />
        <div className="text-center">
          <p className="text-xl sm:text-3xl font-bold text-foreground/80">GOVERNMENT OF INDIA</p>
          <p className="text-xl sm:text-3xl font-bold text-foreground/80">MINISTRY OF RAILWAYS</p>
        </div>
        <img
          src={logos[1].src}
          alt={logos[1].alt}
          className="block max-w-[140px] h-auto bg-white p-2 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
        />
      </div>
    </div>
  );
};

export default LogoShowcase;