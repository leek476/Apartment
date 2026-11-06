"use client";

import { useState } from "react";

export default function ListingGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section aria-label="Apartment photos">
      <div className="overflow-hidden rounded-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selectedImage]}
          alt={`${title}, photo ${selectedImage + 1}`}
          className="h-[24rem] w-full object-cover sm:h-[32rem]"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={selectedImage === index}
              className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                selectedImage === index ? "border-[#1e5a3a]" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                className="h-20 w-28 object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <p className="mt-2 text-sm text-gray-500">
        {images.length} {images.length === 1 ? "photo" : "photos"}
      </p>
    </section>
  );
}
