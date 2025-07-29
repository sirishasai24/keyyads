import { UseFormGetValues } from 'react-hook-form';
import { FormValues } from '../AddPropertyForm';

type ReviewStepProps = {
    getValues: UseFormGetValues<FormValues>;
    location: { lat: number; lng: number };
    images: string[];
    formatReviewValue: (value: string | number | null | undefined, placeholder?: string) => string | number | undefined;
};

const ReviewStep = ({ getValues, location, images, formatReviewValue }: ReviewStepProps) => {
    const selectedType = getValues('type');
    return (
        <div className="text-gray-700 space-y-8">
            <p className="text-xl font-semibold text-center text-[#2180d3]">Review Your Property Listing</p>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Owner Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Owner Name</span>
                        <span className="text-gray-800">{getValues('username')}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Contact Number</span>
                        <span className="text-gray-800">{getValues('contact')}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Address</span>
                        <span className="text-gray-800">{getValues('address')}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Title</span>
                        <span className="text-gray-800">{getValues('title')}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Property Type</span>
                        <span className="text-gray-800">{selectedType === 'land' ? 'Open Land / Farm Land' : 'House Property'}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">For</span>
                        <span className="text-gray-800">{getValues('saleType')}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Area</span>
                        <span className="text-gray-800">{`${getValues('area')} ${getValues('areaUnit')}`}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Price</span>
                        <span className="text-gray-800">{`₹ ${getValues('price')}`}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Discount</span>
                        <span className="text-gray-800">{formatReviewValue(getValues('discount'), '0%')}%</span>
                    </div>

                    {selectedType === 'land' && (
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-500">Category</span>
                            <span className="text-gray-800">{getValues('landCategory') || 'N/A'}</span>
                        </div>
                    )}
                    {selectedType === 'building' && (
                        <>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-500">Floors</span>
                                <span className="text-gray-800">{formatReviewValue(getValues('floors'), 'N/A')}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-500">Parking</span>
                                <span className="text-gray-800">{formatReviewValue(getValues('parking'), 'N/A')}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-500">Bedrooms</span>
                                <span className="text-gray-800">{formatReviewValue(getValues('bedrooms'))}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-500">Bathrooms</span>
                                <span className="text-gray-800">{formatReviewValue(getValues('bathrooms'))}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-500">Property Age</span>
                                <span className="text-gray-800">{formatReviewValue(getValues('propertyAge'))}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-500">Furnishing</span>
                                <span className="text-gray-800">{formatReviewValue(getValues('furnishing'))}</span>
                            </div>
                        </>
                    )}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-500">Facing</span>
                        <span className="text-gray-800">{getValues('facing')}</span>
                    </div>
                    {selectedType === 'building' && (
                        <div className="flex flex-col sm:col-span-2">
                            <span className="font-medium text-gray-500">Other Details</span>
                            <p className="text-gray-800 mt-1 break-words">{formatReviewValue(getValues('otherDetails'), 'No other details provided.')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Location</h2>
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-500">Coordinates</span>
                    <span className="text-gray-800">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Images</h2>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img, i) => (
                        <img key={i} src={img} className="w-full h-auto object-cover rounded-lg shadow-sm border" alt={`Property thumbnail ${i + 1}`} />
                    ))}
                    {images.length === 0 && <p className="text-gray-500 text-sm mt-1">No images uploaded.</p>}
                </div>
            </div>
        </div>
    );
};

export default ReviewStep;