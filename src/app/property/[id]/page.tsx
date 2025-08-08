'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Location {
  city: string;
  state: string;
  lat?: number;
  lng?: number;
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

interface LoggedInUser extends User {
  plan: 'Free' | 'Quarterly Plan' | 'Half Yearly Plan' | 'Annual Plan';
}

const DEFAULT_FREE_USER: LoggedInUser = {
  _id: 'guest',
  username: 'Guest User',
  email: '',
  phone: '',
  profileImageURL: '/profile.png',
  plan: 'Free',
};

const keyyardsAdmin: User = {
  _id: 'admin',
  username: 'Keyyards Support',
  email: 'support@keyyards.in',
  phone: '04049449339',
  profileImageURL: '/profile.png'
};

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(DEFAULT_FREE_USER);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/property/${id}`);
        setProperty(res.data.property);
        setSeller(res.data.user);

        if (res.data.property.images?.length > 0) {
          setMainImage(res.data.property.images[0]);
        }

        const relatedRes = await axios.get(`/api/property/related/${id}`);
        setRelatedProperties(relatedRes.data.relatedProperties);

        try {
          const userRes = await axios.get('/api/auth/me');
          if (userRes.data?.user) {
            setLoggedInUser(userRes.data.user as LoggedInUser);
          }
        } catch (userError) {
          console.error('Failed to fetch logged-in user, assuming Free plan:', userError);
        }

      } catch (error) {
        console.error('Failed to fetch property details or related properties:', error);
        setProperty(null);
        setRelatedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPropertyDetails();
  }, [id]);

  const capitalize = (str: string | null | undefined) => {
    if (str === null || str === undefined || str === "") return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description || 'Check out this amazing property!',
          url: window.location.href,
        });
        console.log('Successfully shared');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  const isSubscriber = loggedInUser && loggedInUser.plan !== 'Free';

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
      <div className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100 flex-grow basis-1/2 min-w-0 md:basis-auto">
        {iconClass && <i className={`${iconClass} ${iconColorClass} mr-2 text-base sm:text-xl`}></i>}
        <div className="flex-1">
          <p className="font-semibold text-xs sm:text-sm text-gray-600 truncate">{label}:</p>
          <p className="text-gray-800 font-bold text-sm sm:text-base truncate">{displayValue}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">

        <div className="p-4 md:p-8 border-b border-gray-200 bg-gradient-to-r from-white to-[#f0f6fc]">
          <div className="flex justify-between items-start mb-3 flex-wrap gap-y-2">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2180d3] leading-tight">
                ₹{property.price.toLocaleString('en-IN')}
              </h1>
              {property.transactionType === 'rent' && (
                <span className="text-base text-gray-600 font-semibold md:ml-0.5">/month</span>
              )}
              {property.discount > 0 && (
                <span className="text-base text-red-500 font-bold ml-2">
                  ({property.discount}% Off)
                </span>
              )}
            </div>
            <div className="flex gap-2">
                {/* 🔄 This is the updated share button */}
                <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#2180d3] rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer hover:bg-[#1a6cb2] focus:outline-none focus:ring-2 focus:ring-[#2180d3]/50"
                    title="Share this property"
                >
                    <i className="fas fa-share-alt mr-2"></i>
                    <span>Share</span>
                </button>
                <button className="p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100">
                    <i className="text-lg fas fa-ellipsis-h"></i>
                </button>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-2">
            {property.bedrooms !== undefined && property.bedrooms !== null && property.type === 'building' ? `${property.bedrooms} BHK ` : ''}
            {property.area ? `${property.area} ${property.areaUnit ? capitalize(property.areaUnit) : 'sq-ft'} ` : ''}
            {capitalize(property.type)} For {capitalize(property.transactionType)}
          </h2>
          <p className="flex items-center text-sm text-gray-700 mb-4">
            <i className="mr-2 text-base text-gray-500 fas fa-map-marker-alt"></i>
            {property.address ? `${property.address}, ` : ''}
            {property.location.city}, {property.location.state}
          </p>

          {property.type === 'building' && (
            <div className="flex flex-wrap justify-center p-3 bg-[#e6f0f7] border border-[#a8c9e7] rounded-lg shadow-inner gap-x-4 gap-y-2 md:justify-start text-gray-800 text-sm">
              {property.bedrooms !== undefined && property.bedrooms !== null && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-1.5 text-base fas fa-bed"></i> {property.bedrooms} Beds
                </span>
              )}
              {property.bathrooms !== undefined && property.bathrooms !== null && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-1.5 text-base fas fa-bath"></i> {property.bathrooms} Baths
                </span>
              )}

              {property.furnishing && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-1.5 text-base fas fa-couch"></i> {capitalize(property.furnishing)}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 p-4 md:p-8 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-center mb-3 overflow-hidden bg-gray-100 border rounded-lg shadow-xl aspect-video border-gray-200">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={property.title || 'Property Main Image'}
                    className="object-contain w-auto max-h-[300px] sm:max-h-[500px] mx-auto transition-transform duration-500 transform"
                  />
                ) : (
                  <div className="flex flex-col items-center p-6 text-lg text-gray-500">
                    <i className="mb-3 text-5xl text-gray-300 fas fa-image"></i> No images to display.
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 xl:grid-cols-6 gap-2 pr-1 overflow-y-auto max-h-[100px] custom-scrollbar">
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
                  <div className="flex items-center justify-center col-span-full h-full min-h-[60px] text-sm text-gray-500 bg-gray-200 rounded-lg">
                    No thumbnails available
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-md">
              <h3 className="mb-3 text-lg font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Property Highlights</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                  <div className="flex items-center p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm flex-grow basis-1/2 min-w-0 md:basis-auto">
                    <i className="mr-2 text-base sm:text-xl text-yellow-700 fas fa-star"></i>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-yellow-800 truncate">Premium Listing</p>
                      <p className="text-sm sm:text-base font-bold text-yellow-700 truncate">Enhanced Visibility</p>
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

            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-md">
              <h3 className="mb-3 text-lg font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Property Description</h3>
              <p className="text-sm leading-relaxed text-gray-700 mb-4">
                {property.description || 'This property presents an exceptional opportunity, combining modern comforts with a prime location to offer a desirable living or investment space. Discover its unique advantages and envision your future here.'}
              </p>
              {property.otherDetails && (
                <div className="pt-3 mt-4 border-t border-gray-100">
                  <h4 className="mb-2 text-base font-semibold text-gray-800">Additional Information:</h4>
                  <p className="p-3 text-sm italic leading-relaxed text-gray-700 bg-gray-50 border border-gray-100 rounded-lg shadow-inner">
                    {property.otherDetails}
                  </p>
                </div>
              )}
            </div>

            {relatedProperties.length > 0 && (
              <div className="p-4 mb-6 bg-white border border-gray-200 rounded-xl shadow-md">
                <h3 className="mb-4 text-lg font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Related Properties</h3>
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={15}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 25,
                    },
                  }}
                  className="related-properties-swiper"
                >
                  {relatedProperties.map((relatedProperty) => (
                    <SwiperSlide key={relatedProperty._id}>
                      <Link href={`/property/${relatedProperty._id}`} className="block">
                        <div className="bg-gray-50 border border-gray-100 rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-md h-full flex flex-col">
                          {relatedProperty.images && relatedProperty.images.length > 0 ? (
                            <img
                              src={relatedProperty.images[0]}
                              alt={relatedProperty.title}
                              className="w-full h-36 object-cover"
                            />
                          ) : (
                            <div className="w-full h-36 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                              No Image
                            </div>
                          )}
                          <div className="p-3 flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">{relatedProperty.title}</h4>
                              <p className="text-xs text-gray-600 mb-1 flex items-center">
                                <i className="fas fa-map-marker-alt text-xs mr-1 text-gray-500"></i>
                                {relatedProperty.location.city}, {relatedProperty.location.state}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#2180d3] font-bold text-base mb-1">
                                ₹{relatedProperty.price.toLocaleString('en-IN')}
                                {relatedProperty.transactionType === 'rent' && <span className="text-xs text-gray-600">/month</span>}
                              </p>
                              <div className="flex flex-wrap items-center text-xs text-gray-700 gap-x-2">
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
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <div className="hidden mt-6 lg:flex gap-4">
              {/* Desktop-only Contact Buttons (kept as comments as per original) */}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="flex flex-col gap-4 lg:sticky lg:top-8">
              {/* Conditional Contact Card */}
              <div className="p-4 text-center bg-white border border-gray-200 rounded-xl shadow-lg">
                <h3 className="mb-4 text-lg font-bold text-gray-800">Interested? Contact Us!</h3>

                {/* Always show Keyyards Admin details */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="mb-2 text-base font-semibold text-gray-900">Keyyards Admin</h4>
                  <img
                    src={keyyardsAdmin.profileImageURL}
                    alt={keyyardsAdmin.username}
                    className="object-cover w-16 h-16 mx-auto mb-2 border-2 rounded-full border-gray-300 shadow-sm"
                  />
                  <p className="text-sm font-bold text-gray-800">{keyyardsAdmin.username}</p>
                  <p className="flex items-center justify-center mt-1 text-sm text-gray-700">
                    <i className="fas fa-envelope mr-2 text-gray-500"></i>
                    <a href={`mailto:${keyyardsAdmin.email}`} className="hover:underline">{keyyardsAdmin.email}</a>
                  </p>
                  <p className="flex items-center justify-center text-sm text-gray-700">
                    <i className="fas fa-phone-alt mr-2 text-gray-500"></i>
                    <a href={`tel:+91-${keyyardsAdmin.phone}`} className="hover:underline">{keyyardsAdmin.phone}</a>
                  </p>
                </div>

                {isSubscriber ? (
                  // Display seller details for subscribers
                  <div>
                    <h4 className="mb-2 text-base font-semibold text-gray-900">Seller Details</h4>
                    <img
                      src={seller?.profileImageURL || '/default-avatar.png'}
                      alt={seller?.username || 'Seller'}
                      className="object-cover w-16 h-16 mx-auto mb-2 border-2 rounded-full border-[#2180d3] shadow-sm"
                    />
                    <p className="text-sm font-bold text-gray-800">{seller?.username || 'Seller Name'}</p>
                    <p className="flex items-center justify-center mt-1 text-sm text-gray-700">
                      <i className="fas fa-envelope mr-2 text-gray-500"></i>
                      <a href={`mailto:${seller?.email}`} className="hover:underline">{seller?.email || 'N/A'}</a>
                    </p>
                    <p className="flex items-center justify-center text-sm text-gray-700">
                      <i className="fas fa-phone-alt mr-2 text-gray-500"></i>
                      <a href={`tel:+91-${seller?.phone}`} className="hover:underline">+91-{seller?.phone || 'N/A'}</a>
                    </p>
                  </div>
                ) : (
                  // Display a message for free users to subscribe
                  <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                    <p>Contact details for the seller are available for subscribers.</p>
                    <Link href="/user/prime" className="text-[#2180d3] font-semibold hover:underline mt-1 block">
                      Subscribe now to view!
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}