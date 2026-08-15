"use client";

import React from "react";

interface TrekAboutProps {
  trekName: string;
  paragraphs: string[];
}

export default function TrekAbout({ trekName, paragraphs }: TrekAboutProps) {
  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">About {trekName}</h2>
      <div className="text-sm text-gray-650 leading-relaxed space-y-4">
        {paragraphs.map((text, idx) => (
          <p key={idx}>{text}</p>
        ))}
      </div>
    </>
  );
}
