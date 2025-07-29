'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<any | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]) // New state for related properties
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true) // Start loading
        const res = await axios.get(`/api/property/${id}`)
        setProperty(res.data.property)
        setUser(res.data.user)
        if (res.data.property.images && res.data.property.images.length > 0) {
          setMainImage(res.data.property.images[0])
        }

        // Fetch related properties after main property details are loaded
        const relatedRes = await axios.get(`/api/property/${id}/related`)
        setRelatedProperties(relatedRes.data.relatedProperties)

      } catch (error) {
        console.error('Failed to fetch property details or related properties:', error)
        setProperty(null)
        setRelatedProperties([]) // Clear related properties on error
      } finally {
        setLoading(false) // End loading
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

  // Helper function to render a detail row if value exists
  const DetailCard = ({ label, value, iconClass, iconColorClass = 'text-gray-500' }: { label: string, value: string | number | null | undefined, iconClass?: string, iconColorClass?: string }) => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === "") || (typeof value === 'number' && isNaN(value))) return null;

    let displayValue = value;
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
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">

        {/* Top Header Section: Price, Title, Location, and Basic Features */}
        <div className="p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-white to-[#f0f6fc]">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-y-3">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2180d3] leading-tight">
                ₹{property.price.toLocaleString('en-IN')}
              </h1>
              {property.transactionType === 'rent' && (
                <span className="text-lg text-gray-600 font-semibold md:ml-0.5">/month</span>
              )}
              {property.discount > 0 && (
                <span className="text-lg text-red-500 font-bold ml-2">
                  ({property.discount}% Off)
                </span>
              )}
            </div>
            {/* More options icon */}
            <button className="p-2 text-gray-500 transition-colors rounded-full hover:text-gray-700 hover:bg-gray-100">
              <i className="text-lg fas fa-ellipsis-h"></i>
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {property.bedrooms !== undefined && property.bedrooms !== null && property.type === 'building' ? `${property.bedrooms} BHK ` : ''}
            {property.area ? `${property.area} ${property.areaUnit ? capitalize(property.areaUnit) : 'sq-ft'} ` : ''}
            {capitalize(property.type)} For {capitalize(property.transactionType)}
          </h2>
          <p className="flex items-center text-base text-gray-700 mb-6">
            <i className="mr-2 text-lg text-gray-500 fas fa-map-marker-alt"></i>
            {property.address ? `${property.address}, ` : ''}
            {property.location.city}, {property.location.state}
            
          </p>

          {/* Basic Property Details - Adjusted for 'building' type */}
          {property.type === 'building' && (
            <div className="flex flex-wrap justify-center p-4 bg-[#e6f0f7] border border-[#a8c9e7] rounded-lg shadow-inner gap-x-6 gap-y-3 md:justify-start text-gray-800">
              {property.bedrooms !== undefined && property.bedrooms !== null && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-2 text-lg fas fa-bed"></i> {property.bedrooms} Beds
                </span>
              )}
              {property.bathrooms !== undefined && property.bathrooms !== null && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-2 text-lg fas fa-bath"></i> {property.bathrooms} Baths
                </span>
              )}
              
              {property.furnishing && (
                <span className="flex items-center text-[#2180d3] font-medium">
                  <i className="mr-2 text-lg fas fa-couch"></i> {capitalize(property.furnishing)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area: Left (Image Gallery, Description, Features) & Right (Contact/Download) */}
        <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-3">

          {/* Left Column: Main Property Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4 overflow-hidden bg-gray-100 border rounded-lg shadow-xl aspect-video border-gray-200">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={property.title || 'Property Main Image'}
                    className="object-cover w-auto max-h-[500px] mx-auto transition-transform duration-500 transform hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center p-8 text-xl text-gray-500">
                    <i className="mb-4 text-6xl text-gray-300 fas fa-image"></i> No images to display.
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3 pr-2 overflow-y-auto sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 xl:grid-cols-6 max-h-[120px] custom-scrollbar">
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
                  <div className="flex items-center justify-center col-span-full h-full min-h-[80px] text-base text-gray-500 bg-gray-200 rounded-lg">
                    No thumbnails available
                  </div>
                )}
                {property.images.length > 4 && (
                  <div className="flex items-center justify-center col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1 xl:col-span-1">
                      <button className="px-4 py-2 text-sm font-semibold text-white transition-colors rounded-lg shadow-md bg-[#2180d3] hover:bg-[#1a66a7]">
                        +{property.images.length - 3} Photos
                      </button>
                  </div>
                )}
              </div>
            </div>

            {/* Property Specific Details (Table-like layout from image) */}
            <div className="p-6 mb-8 bg-white border border-gray-200 rounded-xl shadow-md">
                <h3 className="mb-4 text-xl font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Property Highlights</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Common fields */}
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

                    {/* Building-specific fields */}
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

                    {/* Land-specific fields */}
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


            {/* Property Description Section */}
            <div className="p-6 mb-8 bg-white border border-gray-200 rounded-xl shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Property Description</h3>
              <p className="text-sm leading-relaxed text-gray-700 mb-5">
                {property.description || 'This property presents an exceptional opportunity, combining modern comforts with a prime location to offer a desirable living or investment space. Discover its unique advantages and envision your future here.'}
              </p>
              {property.otherDetails && (
                <div className="pt-4 mt-6 border-t border-gray-100">
                  <h4 className="mb-3 text-lg font-semibold text-gray-800">Additional Information:</h4>
                  <p className="p-4 text-sm italic leading-relaxed text-gray-700 bg-gray-50 border border-gray-100 rounded-lg shadow-inner">
                    {property.otherDetails}
                  </p>
                </div>
              )}
            </div>

            {/* Related Properties Section */}
            {relatedProperties.length > 0 && (
                <div className="p-6 mb-8 bg-white border border-gray-200 rounded-xl shadow-md">
                    <h3 className="mb-6 text-xl font-bold text-gray-800 border-l-4 border-[#2180d3] pl-3">Related Properties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProperties.map((relatedProperty) => (
                            <a key={relatedProperty._id} href={`/property/${relatedProperty._id}`} className="block">
                                <div className="bg-gray-50 border border-gray-100 rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-md">
                                    {relatedProperty.images && relatedProperty.images.length > 0 ? (
                                        <img
                                            src={relatedProperty.images[0]}
                                            alt={relatedProperty.title}
                                            className="w-full h-40 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{relatedProperty.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                                            <i className="fas fa-map-marker-alt text-xs mr-1 text-gray-500"></i>
                                            {relatedProperty.location.city}, {relatedProperty.location.state}
                                        </p>
                                        <p className="text-[#2180d3] font-bold text-base mb-2">
                                            ₹{relatedProperty.price.toLocaleString('en-IN')}
                                            {relatedProperty.transactionType === 'rent' && <span className="text-sm text-gray-600">/month</span>}
                                        </p>
                                        <div className="flex items-center text-sm text-gray-700">
                                            {relatedProperty.type === 'building' && relatedProperty.bedrooms && (
                                                <span className="mr-3 flex items-center"><i className="fas fa-bed text-sm mr-1"></i> {relatedProperty.bedrooms} Beds</span>
                                            )}
                                            {relatedProperty.type === 'building' && relatedProperty.bathrooms && (
                                                <span className="mr-3 flex items-center"><i className="fas fa-bath text-sm mr-1"></i> {relatedProperty.bathrooms} Baths</span>
                                            )}
                                            {relatedProperty.area && (
                                                <span className="flex items-center"><i className="fas fa-ruler-combined text-sm mr-1"></i> {relatedProperty.area} {capitalize(relatedProperty.areaUnit)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}


            {/* Bottom Contact Buttons (desktop only) */}
            <div className="hidden mt-8 lg:flex gap-6">
                <button className="flex-1 px-6 py-3.5 font-bold text-white transition duration-300 ease-in-out transform rounded-lg shadow-lg bg-[#2180d3] hover:bg-[#1a66a7] hover:scale-105">
                    <i className="mr-3 fas fa-paper-plane"></i> Contact Agent
                </button>
                <button className="flex-1 px-6 py-3.5 font-bold text-[#2180d3] transition duration-300 ease-in-out transform border-2 border-[#2180d3] rounded-lg shadow-lg hover:bg-[#e6f0f7] hover:scale-105">
                    <i className="mr-3 fas fa-phone-alt"></i> Get Phone No.
                </button>
            </div>
          </div>

          {/* Right Column: Contact Agent & Download Brochure (Fixed/Sticky behavior for larger screens) */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-6 lg:sticky lg:top-8">
              {/* Contact Agent Card */}
              <div className="p-6 text-center bg-white border border-gray-200 rounded-xl shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-gray-800">Interested?</h3>
                <img
                  src={user?.profileImageURL || '/default-avatar.png'}
                  alt={user?.username || 'Agent'}
                  className="object-cover w-24 h-24 mx-auto mb-4 border-4 rounded-full shadow-md border-[#2180d3]"
                />
                <p className="mb-1 text-lg font-bold text-gray-900">{user?.username || 'Agent Name'}</p>
                {user?.email && (
                    <p className="flex items-center justify-center mb-2 text-sm text-gray-700">
                        <i className="mr-2 text-gray-500 fas fa-envelope"></i>{user.email}
                    </p>
                )}
                <p className="flex items-center justify-center mb-4 text-sm text-gray-700">
                  <i className="mr-2 text-gray-500 fas fa-phone-alt"></i> +91-{user?.phone ? user.phone.slice(0, 5) : 'XXXXX'}XXXXX
                </p>
                <button className="w-full py-3.5 font-bold text-white transition duration-300 ease-in-out transform rounded-lg shadow-md bg-[#2180d3] hover:bg-[#1a66a7] hover:scale-105 mb-3">
                  <i className="mr-2 fas fa-phone-alt"></i> Get Phone No.
                </button>
              </div>

              {/* Download Brochure Card */}
              <div className="p-6 text-center bg-white border border-gray-200 rounded-xl shadow-lg">
                <i className="mb-4 text-4xl text-red-500 fas fa-file-pdf"></i>
                <h3 className="mb-2 text-lg font-bold text-gray-800">Download Brochure</h3>
                <p className="mb-5 text-sm text-gray-600">Access detailed property information and floor plans.</p>
                <button className="flex items-center justify-center w-full py-3.5 font-bold text-white transition duration-300 ease-in-out transform rounded-lg shadow-md bg-[#2180d3] hover:bg-[#1a66a7] hover:scale-105">
                  <i className="mr-2 fas fa-download "></i> Download Full Brochure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating/Bottom Contact Agent and Get Phone No. for smaller screens */}
        <div className="sticky bottom-0 left-0 right-0 z-10 flex justify-between gap-4 p-4 bg-white border-t border-gray-200 lg:hidden shadow-lg">
            <button className="flex-1 px-4 py-3.5 font-bold text-white transition-colors rounded-lg shadow-md bg-[#2180d3] hover:bg-[#1a66a7]">
                <i className="mr-2 fas fa-phone-alt"></i> Contact
            </button>
            <button className="flex-1 px-4 py-3.5 font-bold text-[#2180d3] transition-colors border-2 border-[#2180d3] rounded-lg shadow-md hover:bg-[#e6f0f7]">
                <i className="mr-2 fas fa-envelope"></i> Enquire
            </button>
        </div>

      </div>
    </div>
  )
}