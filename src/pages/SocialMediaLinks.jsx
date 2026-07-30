import React from 'react';

export default function SocialMediaLinks() {
  const shopData = {
    name: "The Vanilla Shop",
    handle: "@thevanillashop",
    bio: "Discover The Vanilla Shop — a premium vanilla-centric café & boutique offering delightful vanilla-infused drinks, desserts, artisanal products and sensory experiences that celebrate the rich, aromatic world of vanilla.",
    avatarUrl: "https://thevanillashop.lk/logo.png",
    links: [
      {
        id: "website",
        title: "Visit Our Official Website",
        url: "https://thevanillashop.lk",
        // Globe SVG
        icon: (
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        ),
        accentBg: "bg-indigo-50 group-hover:bg-indigo-100",
        borderHover: "hover:border-indigo-300"
      },
      {
        id: "instagram",
        title: "Follow on Instagram",
        url: "https://www.instagram.com/the_vanillashop",
        // Instagram SVG
        icon: (
          <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        ),
        accentBg: "bg-pink-50 group-hover:bg-pink-100",
        borderHover: "hover:border-pink-300"
      },
      {
        id: "tiktok",
        title: "Watch on TikTok",
        url: "https://www.tiktok.com/@the_vanillashop",
        // TikTok SVG
        icon: (
          <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.1v-3.5a6.37 6.37 0 0 0-1-.08A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.33 22 6.33 6.33 0 0 0 15.67 15.67V9a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.85-.43z"/>
          </svg>
        ),
        accentBg: "bg-slate-100 group-hover:bg-slate-200",
        borderHover: "hover:border-slate-400"
      },
      {
        id: "facebook",
        title: "Connect on Facebook",
        url: "https://www.facebook.com/thevanillashopsl",
        // Facebook SVG
        icon: (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        ),
        accentBg: "bg-blue-50 group-hover:bg-blue-100",
        borderHover: "hover:border-blue-300"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between py-12 px-4 sm:px-6">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <img
              src={shopData.avatarUrl}
              alt={shopData.name}
              className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-white"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {shopData.name}
          </h1>
          <p className="text-xs font-semibold text-indigo-600 mb-2">
            {shopData.handle}
          </p>
          <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
            {shopData.bio}
          </p>
        </div>

        {/* Buttons List */}
        <div className="w-full space-y-3.5">
          {shopData.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between w-full p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md ${link.borderHover}`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2.5 rounded-xl transition-colors duration-200 ${link.accentBg}`}>
                  {link.icon}
                </div>
                <span className="font-semibold text-slate-800 text-sm group-hover:text-slate-900">
                  {link.title}
                </span>
              </div>
              
              {/* External Arrow Icon */}
              <div className="pr-1">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>

      </div>

      {/* Minimal Footer */}
      <footer className="mt-12 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {shopData.name}. All rights reserved.
      </footer>
    </div>
  );
}