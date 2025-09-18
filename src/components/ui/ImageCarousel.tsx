1
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
 
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
 
const images = [
  {
    src: "https://www.ireps.gov.in/ireps/images/home/image03a.jpg",
    alt: "A Vande Bharat Express train crossing a scenic bridge, representing modern Indian Railways.",
    title: "Modernizing Indian Railways",
    description: "Embracing technology for a faster, safer, and more efficient railway network.",
  },
  {
    src: "https://www.ireps.gov.in/ireps/images/home/ireps4.png",
    alt: "A collage showcasing the digital transformation of Indian Railways through the IREPS platform.",
    title: "Digital Procurement with IREPS",
    description: "Streamlining the procurement process with our integrated e-Procurement System.",
  },
  {
    src: "https://www.ireps.gov.in/ireps/images/home/image05a.png",
    alt: "A freight train carrying containers, highlighting the logistics and supply chain of Indian Railways.",
    title: "Powering National Logistics",
    description: "Efficient freight and container services forming the backbone of India's supply chain.",
  },
  {
    src: "https://www.ireps.gov.in/ireps/images/home/image04a.jpg",
    alt: "A passenger train at a station platform, symbolizing the vast network of Indian Railways.",
    title: "Connecting India, Connecting People",
    description: "Our extensive passenger network brings millions of people closer every day.",
  },
];
 
const ImageCarousel = () => {
  return (
    <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
        }),
      ]}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden border-0 rounded-lg shadow-rail-md">
              <CardContent className="relative flex aspect-[3/1] items-center justify-center p-0 text-white">
                <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16">
                  <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold drop-shadow-lg max-w-2xl">
                    {image.title}
                  </h2>
                  <p className="mt-2 md:text-lg max-w-xl hidden sm:block drop-shadow-md">
                    {image.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 hidden sm:inline-flex bg-black/40 text-white border-white/50 hover:bg-black/60" />
      <CarouselNext className="right-4 hidden sm:inline-flex bg-black/40 text-white border-white/50 hover:bg-black/60" />
    </Carousel>
  );
};

export default ImageCarousel;