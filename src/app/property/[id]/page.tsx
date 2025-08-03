'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link' // Import Link for proper Next.js navigation
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper components
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules'; // Import Swiper modules
import 'swiper/css'; // Core Swiper styles
import 'swiper/css/navigation'; // Navigation module styles
import 'swiper/css/pagination'; // Pagination module styles


interface Location {
  city: string;
  state: string;
}

interface Property {
  _id: string;
  price: number;
  transactionType: 'sale' | 'rent';
  discount: number;
  bedrooms?: number;
  bathrooms?: number;
  type: 'building' | 'land';
  area?: number;
  areaUnit?: string;
  address?: string;
  location: Location;
  images: string[];
  furnishing?: string;
  parking?: number;
  facing?: string;
  isPremium?: boolean;
  propertyAge?: string;
  floors?: number;
  landCategory?: string;
  title: string;
  description?: string;
  otherDetails?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  profileImageURL?: string;
}

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/property/${id}`)
        setProperty(res.data.property)
        setUser(res.data.user)
        if (res.data.property.images && res.data.property.images.length > 0) {
          setMainImage(res.data.property.images[0])
        }

        const relatedRes = await axios.get(`/api/property/related/${id}`)
        setRelatedProperties(relatedRes.data.relatedProperties)

      } catch (error) {
        console.error('Failed to fetch property details or related properties:', error)
        setProperty(null)
        setRelatedProperties([])
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPropertyDetails()
  }, [id])

  const capitalize = (str: string | null | undefined) => {
    if (str === null || str === undefined || str === "") return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 bg-gray-50">
        <i className="fas fa-spinner fa-spin mr-3 text-2xl text-[#2180d3]"></i> Loading property details...
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 bg-gray-50">
        <i className="fas fa-exclamation-circle mr-3 text-2xl text-red-500"></i> Property not found or an error occurred.
      </div>
    )
  }

  const DetailCard = ({ label, value, iconClass, iconColorClass = 'text-gray-500' }: { label: string, value: string | number | null | undefined, iconClass?: string, iconColorClass?: string }) => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === "") || (typeof value === 'number' && isNaN(value))) return null;

    let displayValue: string | number = value;
    if (typeof value === 'string') {
      displayValue = capitalize(value);
    }

    return (
      <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
        {iconClass && <i className={`${iconClass} ${iconColorClass} mr-3 text-xl`}></i>}
        <div>
          <p className="font-semibold text-sm text-gray-600">{label}:</p>
          <p className="text-gray-800 font-bold text-sm">{displayValue}</p>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4 lg:px-8"> {/* Adjusted padding for mobile */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">

        <div className="p-4 md:p-8 border-b border-gray-200 bg-gradient-to-r from-white to-[#f0f6fc]"> {/* Adjusted padding for mobile */}
          <div className="flex justify-between items-start mb-3 flex-wrap gap-y-2"> {/* Adjusted margin for mobile */}
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2180d3] leading-tight"> {/* Adjusted font size for mobile */}
                ₹{property.price.toLocaleString('en-IN')}
              </h1>
              {property.transactionType === 'rent' && (
                <span className="text-base text-gray-600 font-semibold md:ml-0.5">/month</span> 
              )}
              {property.discount > 0 && (
                <span className="text-base text-red-500 font-bold ml-2"> {/* Adjusted font size for mobile */}
                  ({property.discount}% Off)
                </span>
              )}
            </div>
            <button className="p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100">
              <i className="text-lg fas fa-ellipsis-h"></i>
            </button>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-2"> {/* Adjusted font size for mobile */}
            {property.bedrooms !== undefined && property.bedrooms !== null && property.type === 'building' ? `${property.bedrooms} BHK ` : ''}
            {property.area ? `${property.area} ${property.areaUnit ? capitalize(property.areaUnit) : 'sq-ft'} ` : ''}
            {capitalize(property.type)} For {capitalize(property.transactionType)}
          </h2>
          <p className="flex items-center text-sm text-gray-700 mb-4"> {/* Adjusted font size and margin for mobile */}
            <i className="mr-2 text-base text-gray-500 fas fa-map-marker-alt"></i> {/* Adjusted icon size for mobile */}
            {property.address ? `${property.address}, ` : ''}
            {property.location.city}, {property.location.state}
          </p>

          {property.type === 'building' && (
            <div className="flex flex-wrap justify-center p-3 bg-[#e6f0f7] border border-[#a8c9e7] rounded-lg shadow-inner gap-x-4 gap-y-2 md:justify-start text-gray-800 text-sm"> {/* Adjusted padding, gap, and font size for mobile */}
              {property.bedrooms !== undefined && property.bedrooms !== null && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-1.5 text-base fas fa-bed"></i> {property.bedrooms} Beds {/* Adjusted icon size and margin for mobile */}
                </span>
              )}
              {property.bathrooms !== undefined && property.bathrooms !== null && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-1.5 text-base fas fa-bath"></i> {property.bathrooms} Baths {/* Adjusted icon size and margin for mobile */}
                </span>
              )}

              {property.furnishing && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-1.5 text-base fas fa-couch"></i> {capitalize(property.furnishing)} {/* Adjusted icon size and margin for mobile */}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 p-4 md:p-8 lg:grid-cols-3"> {/* Adjusted padding and gap for mobile */}

          <div className="lg:col-span-2">
            <div className="mb-6"> {/* Adjusted margin for mobile */}
              <div className="flex items-center justify-center mb-3 overflow-hidden bg-gray-100 border rounded-lg shadow-xl aspect-video border-gray-200"> {/* Adjusted margin for mobile */}
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={property.title || 'Property Main Image'}
                    className="object-cover w-auto max-h-[300px] sm:max-h-[500px] mx-auto transition-transform duration-500 transform hover:scale-105" // Max height for mobile
                  />
                ) : (
                  <div className="flex flex-col items-center p-6 text-lg text-gray-500"> {/* Adjusted padding and font size for mobile */}
                    <i className="mb-3 text-5xl text-gray-300 fas fa-image"></i> No images to display. {/* Adjusted icon size and margin for mobile */}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 pr-1 overflow-y-auto sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 xl:grid-cols-6 max-h-[100px] custom-scrollbar"> {/* Adjusted gap and max height for mobile */}
                {property.images?.length > 0 ? (
                  property.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105
                                ${mainImage === img ? 'border-3 border-[#2180d3] shadow-md' : 'border border-gray-300 hover:border-[#2180d3]/50 shadow-sm'}`}
                      onClick={() => setMainImage(img)}
                    >
                      <img
                        src={img}
                        alt={`${property.title || 'Property'} thumbnail ${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center col-span-full h-full min-h-[60px] text-sm text-gray-500 bg-gray-200 rounded-lg"> {/* Adjusted min height and font size for mobile */}
                    No thumbnails available
                  </div>
                )}
                {/* Removed "+X Photos" button as thumbnail grid should handle scrolling, or a modal could be used */}
              </div>
            </div>

            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-md"> {/* Adjusted padding and margin for mobile */}
              <h3 className="mb-3 text-lg font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Property Highlights</h3> {/* Adjusted font size and margin for mobile */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"> {/* Adjusted gap for mobile */}
                <DetailCard
                  label="Listing For"
                  value={capitalize(property.transactionType)}
                  iconClass="fas fa-tag"
                  iconColorClass="text-purple-600"
                />
                <DetailCard
                  label="Area"
                  value={property.area ? `${property.area} ${property.areaUnit ? capitalize(property.areaUnit) : 'Unit'}` : 'N/A'}
                  iconClass="fas fa-ruler-combined"
                  iconColorClass="text-[#2180d3]"
                />
                {property.parking !== undefined && property.parking !== null && (
                  <DetailCard
                    label="Parking"
                    value={property.parking > 0 ? `${property.parking} spaces` : 'No dedicated parking'}
                    iconClass="fas fa-car"
                    iconColorClass="text-gray-600"
                  />
                )}
                {property.facing && property.facing !== "Not Specified" && (
                  <DetailCard
                    label="Direction Facing"
                    value={capitalize(property.facing)}
                    iconClass="fas fa-compass"
                    iconColorClass="text-red-500"
                  />
                )}
                {property.isPremium && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
                    <i className="mr-3 text-xl text-yellow-700 fas fa-star"></i>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">Premium Listing</p>
                      <p className="text-sm font-bold text-yellow-700">Enhanced Visibility</p>
                    </div>
                  </div>
                )}
                {property.discount > 0 && (
                  <DetailCard
                    label="Discount Available"
                    value={`${property.discount}% Off`}
                    iconClass="fas fa-tags"
                    iconColorClass="text-red-500"
                  />
                )}

                {property.type === 'building' && (
                  <>
                    <DetailCard
                      label="Bedrooms"
                      value={property.bedrooms || 'N/A'}
                      iconClass="fas fa-bed"
                      iconColorClass="text-indigo-500"
                    />
                    <DetailCard
                      label="Bathrooms"
                      value={property.bathrooms || 'N/A'}
                      iconClass="fas fa-bath"
                      iconColorClass="text-teal-500"
                    />
                    <DetailCard
                      label="Furnished Status"
                      value={capitalize(property.furnishing || 'Unfurnished')}
                      iconClass="fas fa-couch"
                      iconColorClass="text-amber-600"
                    />
                    <DetailCard
                      label="Age Of Construction"
                      value={property.propertyAge || 'New Property'}
                      iconClass="fas fa-building"
                      iconColorClass="text-green-700"
                    />
                    <DetailCard
                      label="Total Floors"
                      value={property.floors || 'N/A'}
                      iconClass="fas fa-layer-group"
                      iconColorClass="text-blue-500"
                    />
                  </>
                )}

                {property.type === 'land' && (
                  <DetailCard
                    label="Land Category"
                    value={capitalize(property.landCategory)}
                    iconClass="fas fa-tree"
                    iconColorClass="text-lime-700"
                  />
                )}
              </div>
            </div>


            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-md"> {/* Adjusted padding and margin for mobile */}
              <h3 className="mb-3 text-lg font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Property Description</h3> {/* Adjusted font size and margin for mobile */}
              <p className="text-sm leading-relaxed text-gray-700 mb-4"> {/* Adjusted font size and margin for mobile */}
                {property.description || 'This property presents an exceptional opportunity, combining modern comforts with a prime location to offer a desirable living or investment space. Discover its unique advantages and envision your future here.'}
              </p>
              {property.otherDetails && (
                <div className="pt-3 mt-4 border-t border-gray-100"> {/* Adjusted padding and margin for mobile */}
                  <h4 className="mb-2 text-base font-semibold text-gray-800">Additional Information:</h4> {/* Adjusted font size and margin for mobile */}
                  <p className="p-3 text-sm italic leading-relaxed text-gray-700 bg-gray-50 border border-gray-100 rounded-lg shadow-inner"> {/* Adjusted padding and font size for mobile */}
                    {property.otherDetails}
                  </p>
                </div>
              )}
            </div>

            {relatedProperties.length > 0 && (
              <div className="p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-md"> {/* Adjusted padding and margin for mobile */}
                <h3 className="mb-4 text-lg font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Related Properties</h3> {/* Adjusted font size and margin for mobile */}
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={15} // Gap between slides
                  slidesPerView={1} // Default for mobile
                  navigation // Enable navigation arrows
                  pagination={{ clickable: true }} // Enable pagination dots
                  scrollbar={{ draggable: true }} // Enable scrollbar
                  breakpoints={{
                    // When window width is >= 640px (sm)
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    // When window width is >= 1024px (lg)
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 25,
                    },
                  }}
                  className="related-properties-swiper" // Add a class for potential custom styling
                >
                  {relatedProperties.map((relatedProperty) => (
                    <SwiperSlide key={relatedProperty._id}>
                      <Link href={`/property/${relatedProperty._id}`} className="block">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-md h-full"> {/* Ensure consistent height */}
                          {relatedProperty.images && relatedProperty.images.length > 0 ? (
                            <img
                              src={relatedProperty.images[0]}
                              alt={relatedProperty.title}
                              className="w-full h-36 object-cover" // Adjusted height for slider item
                            />
                          ) : (
                            <div className="w-full h-36 bg-gray-200 flex items-center justify-center text-gray-500 text-sm"> {/* Adjusted height and font size */}
                              No Image
                            </div>
                          )}
                          <div className="p-3"> {/* Adjusted padding */}
                            <h4 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">{relatedProperty.title}</h4> {/* Adjusted font size */}
                            <p className="text-xs text-gray-600 mb-1 flex items-center"> {/* Adjusted font size */}
                              <i className="fas fa-map-marker-alt text-xs mr-1 text-gray-500"></i>
                              {relatedProperty.location.city}, {relatedProperty.location.state}
                            </p>
                            <p className="text-[#2180d3] font-bold text-base mb-1"> {/* Adjusted font size */}
                              ₹{relatedProperty.price.toLocaleString('en-IN')}
                              {relatedProperty.transactionType === 'rent' && <span className="text-xs text-gray-600">/month</span>} {/* Adjusted font size */}
                            </p>
                            <div className="flex flex-wrap items-center text-xs text-gray-700 gap-x-2"> {/* Adjusted font size and gap */}
                              {relatedProperty.type === 'building' && relatedProperty.bedrooms && (
                                <span className="flex items-center"><i className="fas fa-bed text-xs mr-1"></i> {relatedProperty.bedrooms} Beds</span>
                              )}
                              {relatedProperty.type === 'building' && relatedProperty.bathrooms && (
                                <span className="flex items-center"><i className="fas fa-bath text-xs mr-1"></i> {relatedProperty.bathrooms} Baths</span>
                              )}
                              {relatedProperty.area && (
                                <span className="flex items-center"><i className="fas fa-ruler-combined text-xs mr-1"></i> {relatedProperty.area} {capitalize(relatedProperty.areaUnit)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <div className="hidden mt-6 lg:flex gap-4"> {/* Adjusted margin for mobile */}
              {/* Desktop-only Contact Buttons (kept as comments as per original) */}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="flex flex-col gap-4 lg:sticky lg:top-8"> {/* Adjusted gap for mobile */}
              <div className="p-4 text-center bg-white border border-gray-200 rounded-xl shadow-lg"> {/* Adjusted padding for mobile */}
                <h3 className="mb-3 text-lg font-bold text-gray-800">Interested?</h3> {/* Adjusted font size and margin for mobile */}
                <img
                  src={user?.profileImageURL || '/default-avatar.png'}
                  alt={user?.username || 'Agent'}
                  className="object-cover w-20 h-20 mx-auto mb-3 border-4 rounded-full shadow-md border-[#2180d3]" // Adjusted size for mobile
                />
                <p className="mb-1 text-base font-bold text-gray-900">{user?.username || 'Agent Name'}</p> {/* Adjusted font size */}
                {user?.email && (
                  <p className="flex items-center justify-center mb-1 text-sm text-gray-700"> {/* Adjusted font size and margin */}
                    <i className="mr-2 text-gray-500 fas fa-envelope"></i>{user.email}
                  </p>
                )}
                <p className="flex items-center justify-center mb-3 text-sm text-gray-700"> {/* Adjusted font size and margin */}
                  <i className="mr-2 text-gray-500 fas fa-phone-alt"></i> +91-{user?.phone || 'Not Available'}
                </p>
                {/* Mobile contact buttons will be at the bottom sticky bar */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>  
  )
}