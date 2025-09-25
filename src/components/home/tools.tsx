'use client'

import React from 'react'
import Image from 'next/image'

import LoanCalIcon from '../../../public/homeIcons/loanCal.svg'
import LocationIcon from '../../../public/homeIcons/location.svg'
import AiChatIcon from '../../../public/homeIcons/Aichat.svg'

const tools = [
  {
    href: '/tools/loanCalculator',
    icon: LoanCalIcon,
    imgAlt: 'Loan and interest calculation tool',
    title: 'Know the interest',
    description: 'Calculate your loan EMI & many more',
  },
  {
    href: '/tools/explore-locations',
    icon: LocationIcon,
    imgAlt: 'Find the best spots to live tool',
    title: 'Find the best spots to live',
    description: 'Explore regions and find the property',
  },
  {
    href: '/tools/ai-chat',
    icon: AiChatIcon,
    imgAlt: 'AI assistant chat tool',
    title: 'Talk with our AI swetha',
    description: 'Know the latest trends ask question & many more',
  },
]

export const KeyyardTools = () => {
  return (
    // REDUCED vertical padding
    <section className=" py-12 sm:py-16">
      {/* REDUCED max-width */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title - REDUCED margin-bottom */}
        <div className="text-left mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            Keyyard Tools
          </h2>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map(({ icon, href, imgAlt, title, description }) => (
            <div key={title}>
              <a
                href={href}
                className="group block h-full bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-left transition-all duration-300 ease-in-out hover:shadow-xl hover:border-indigo-500 hover:-translate-y-1"
              >
                {/* REDUCED margin-bottom */}
                <div className="mb-6 flex justify-center">
                  <Image
                    src={icon.src}
                    alt={imgAlt}
                    width={160} // Corresponds to w-40
                    height={160}
                    // REDUCED width and height
                    className="h-auto w-40 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                  <span className="text-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ml-1">
                    &gt;
                  </span>
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm">{description}</p>
              </a>
            </div>
          ))}
        </div>

        {/* Coming Soon Section - REDUCED margin-top */}
        <div className="text-center mt-16">
          <p className="font-semibold text-gray-800">
            more tools coming soon
          </p>
          <p className="text-gray-500 mt-1">Great things take time ❤️</p>
        </div>
      </div>
    </section>
  )
}