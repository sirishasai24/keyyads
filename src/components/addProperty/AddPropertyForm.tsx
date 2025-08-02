'use client'

import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import clsx from 'clsx'
import axios from 'axios'
import { cloudinaryUpload } from '@/lib/cloudinary'

import FormSteps from './AddPropertyFormUI'

export type FormValues = {
    username: string
    contact: string
    state: string
    city: string
    address: string
    title: string
    type: 'building' | 'land'
    saleType: 'sale' | 'rent'
    landCategory?: 'Agricultural' | 'Residential' | 'Commercial'
    floors?: number
    bedrooms?: string
    bathrooms?: string
    propertyAge?: 'New' | '<5 Years' | '5-10 Years' | '>10 Years'
    furnishing?: 'Unfurnished' | 'Semi-furnished' | 'Fully-furnished'
    facing?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West' | 'Not Specified'
    otherDetails?: string
    area: number
    areaUnit: 'sqft' | 'sqyd' | 'sqm' | 'acres'
    location: { lat: number; lng: number }
    images: string[]
    description: string
    price: number
    discount?: number
    parking?: number
    isPremium: 'yes' | 'no'
}

const center = { lat: 17.385044, lng: 78.486671 }

export default function AddPropertyForm() {
    const router = useRouter()
    const [images, setImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [userListingQuota, setUserListingQuota] = useState<number | null>(null);
    const [isLoadingUserQuota, setIsLoadingUserQuota] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // New state for login status


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        getValues,
        formState: { errors }
    } = useForm<FormValues>({
        mode: "onTouched",
        defaultValues: {
            type: 'land',
            saleType: 'sale',
            location: center,
            images: [],
            areaUnit: 'sqft',
            isPremium: 'no',
            facing: 'Not Specified',
            state: '',
            city: ''
        }
    })

    const selectedType = watch('type')

    useEffect(() => {
        const fetchUserQuota = async () => {
            try {
                const response = await axios.get('/api/auth/me');
                if (response.data && response.data.user) {
                    setIsLoggedIn(true); // User is logged in
                    setUserListingQuota(response.data.user.listings);
                } else {
                    // This case handles when the API returns success but no user object,
                    // which might happen if the session is somehow invalid but not an error.
                    setIsLoggedIn(false); // User is not logged in
                    console.warn("User data or 'listings' field not found in /api/auth/me response.");
                    setUserListingQuota(0); // Set quota to 0 as a safeguard
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    // Explicitly handle 401 Unauthorized for not logged in
                    setIsLoggedIn(false);
                } else {
                    // Other errors (network, server issues)
                    console.error('Failed to fetch user listing quota:', error);
                    setFetchError('Failed to load user data. Please try again.');
                    setIsLoggedIn(false); // Assume not logged in if unable to fetch
                }
                setUserListingQuota(0); // Set quota to 0 or appropriate default
            } finally {
                setIsLoadingUserQuota(false);
            }
        };

        fetchUserQuota();
    }, []);

    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return
        setUploading(true)
        const uploaded: string[] = []

        const uploadPromises = Array.from(files).map(async (file) => {
            try {
                const url = await cloudinaryUpload(file)
                uploaded.push(url)
            } catch (uploadError) {
                console.error("Error uploading file to Cloudinary:", uploadError)
                toast.error(`Failed to upload ${file.name}. Please try again.`)
            }
        })

        await Promise.all(uploadPromises)

        const updatedImages = [...images, ...uploaded]
        setImages(updatedImages)
        setValue('images', updatedImages, { shouldValidate: true })
        setUploading(false)
        toast.success(`${uploaded.length} image(s) uploaded successfully!`);
    }

    const handleRemoveImage = (index: number) => {
        const updated = [...images]
        updated.splice(index, 1)
        setImages(updated)
        setValue('images', updated, { shouldValidate: true })
        toast('Image removed.', { icon: '🗑️' });
    }

    const steps = ['Owner Details', 'Property Info', 'Upload Images', 'Location', 'Review & Submit']

    const goToNextStep = async () => {
        let fieldsToValidate: (keyof FormValues)[] = []

        if (currentStep === 0) {
            fieldsToValidate = ['username', 'contact']
        } else if (currentStep === 1) {
            fieldsToValidate = ['state', 'city', 'address', 'title', 'type', 'saleType', 'area', 'areaUnit', 'price']
            if (selectedType === 'land') {
                fieldsToValidate.push('landCategory')
            }
        } else if (currentStep === 2) {
            fieldsToValidate = ['images']
        } else if (currentStep === 3) {
            fieldsToValidate = ['location']
        }

        const isStepValid = await trigger(fieldsToValidate, { shouldFocus: true });

        if (isStepValid) {
            setCurrentStep((prev) => prev + 1)
        } else {
            const firstErrorField = fieldsToValidate.find(field => (errors)[field]); // Cast to any to access properties dynamically
            if (firstErrorField) {
                const element = document.getElementsByName(firstErrorField as string)[0] || document.getElementById(firstErrorField as string);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
            }
            toast.error('Please fill in all required fields to proceed.');
        }
    }

    const goToPreviousStep = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1)
    }

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        setIsSubmitting(true)

        if (userListingQuota !== null && userListingQuota <= 0) {
            toast.error('You have exhausted your property listing quota. Please upgrade your plan to list more properties.');
            setIsSubmitting(false);
            setShowModal(false);
            return;
        }

        try {
            const dataToSubmit: Partial<FormValues> = { // Use Partial<FormValues> for type safety
                ...formData,
            }

            dataToSubmit.isPremium = formData.isPremium

            if (dataToSubmit.facing === 'Not Specified') {
                dataToSubmit.facing = undefined; // Set to undefined to remove from payload if not specified
            }

            if (dataToSubmit.type === 'land') {
                delete dataToSubmit.bedrooms
                delete dataToSubmit.bathrooms
                delete dataToSubmit.floors
                delete dataToSubmit.furnishing
                delete dataToSubmit.propertyAge
                delete dataToSubmit.otherDetails
                delete dataToSubmit.parking
            } else if (dataToSubmit.type === 'building') {
                delete dataToSubmit.landCategory
            }

            if (!dataToSubmit.images || dataToSubmit.images.length === 0) {
                toast.error('Please upload at least one image for the property.');
                setIsSubmitting(false);
                setCurrentStep(2);
                setShowModal(false);
                return;
            }

            console.log('Sending data to API:', dataToSubmit)

            const response = await axios.post('/api/property/add', dataToSubmit)

            console.log('Form data submitted successfully:', response.data.data)
            toast.success('Property submitted successfully!')
            setShowModal(false)
            router.push('/user/properties'); // Redirect to user properties page after successful submission

        } catch (error) {
            console.error('Submission error:', error)
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || error.response.data.error || 'Something went wrong. Please try again.';
                toast.error(errorMessage);
            } else {
                toast.error('Network error or unexpected error. Please try again.');
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatReviewValue = (value: string | number | null | undefined, placeholder: string = 'N/A') => {
        if (value === 'Not Specified' || value === null || value === undefined || value === '') {
            return placeholder
        }
        return value
    }

    // New: Check if login status is still loading
    if (isLoggedIn === null || isLoadingUserQuota) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2180d3]"></div>
                <p className="ml-4 text-lg text-gray-700">Checking authentication...</p>
            </div>
        );
    }

    // New: If not logged in, show a login prompt
    if (isLoggedIn === false) {
        return (
            <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded-3xl shadow-xl border border-gray-100 text-center">
                <h1 className="text-3xl font-bold text-[#2180d3] mb-6">Login Required</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Please log in to your account to add a new property listing.
                </p>
                <button
                    onClick={() => router.push('/auth')} // Assuming a login page at /login
                    className="w-full bg-[#2180d3] hover:bg-[#1a6fb0] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 text-red-600">
                <p className="text-xl font-semibold mb-4">Error: {fetchError}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-[#2180d3] text-white rounded-lg hover:bg-[#1a6fb0] transition-colors shadow-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (userListingQuota !== null && userListingQuota <= 0) {
        return (
            <div className="max-w-md mx-auto p-8 mt-20 bg-white rounded-3xl shadow-xl border border-gray-100 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-6">Listing Quota Exhausted!</h1>
                <p className="text-lg text-gray-700 mb-8">
                    You have used all your available property listings. To add more properties, please consider upgrading your plan.
                </p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => {
                            router.push('/user/prime')
                        }
                        }
                        className="w-full bg-[#2180d3] hover:bg-[#1a6fb0] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        View Plans to Upgrade
                    </button>
                    <button
                        onClick={() => {
                            router.push('/user/properties')
                        }}
                        className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold py-3 px-8 rounded-full shadow-md transition duration-300 ease-in-out"
                    >
                        Go to My Properties
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 mt-10 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#2180d3] mb-8">Add New Property</h1>

            <div className="flex flex-row justify-between mb-10 overflow-x-auto whitespace-nowrap relative">
                <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-300 z-0">
                    <div
                        className="h-full bg-[#2180d3] transition-all duration-500 ease-in-out"
                        style={{
                            width: `${(currentStep / (steps.length - 1)) * 100}%`
                        }}
                    />
                </div>

                {steps.map((label, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center relative mb-4 sm:mb-0 px-2 z-10">
                        <div
                            className={clsx(
                                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-md shrink-0 transition-colors duration-300',
                                currentStep >= i ? 'bg-[#2180d3] text-white' : 'bg-gray-200 text-gray-600'
                            )}
                        >
                            {i + 1}
                        </div>
                        <span className={clsx('text-xs mt-2 text-center hidden sm:block', currentStep >= i ? 'text-[#2180d3]' : 'text-gray-400')}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormSteps
                    currentStep={currentStep}
                    register={register}
                    errors={errors}
                    watch={watch}
                    images={images}
                    uploading={uploading}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    location={getValues('location')}
                    setLocation={(latlng) => setValue('location', latlng, { shouldValidate: true })}
                    getValues={getValues}
                    formatReviewValue={formatReviewValue}
                />

                <div className="flex justify-between mt-10">
                    {currentStep > 0 && (
                        <button type="button" onClick={goToPreviousStep} className="bg-gray-100 px-5 py-2 rounded-lg hover:bg-gray-200 transition" disabled={isSubmitting}>
                            Back
                        </button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <button type="button" onClick={goToNextStep} className="bg-[#2180d3] text-white px-6 py-2 rounded-lg hover:bg-[#1a6cb2] transition" disabled={isSubmitting}>
                            Next
                        </button>
                    ) : (
                        <Dialog open={showModal} onOpenChange={setShowModal}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="bg-[#2180d3] text-white px-6 py-2 rounded-lg hover:bg-[#1a6cb2] transition"
                                    disabled={isSubmitting || (userListingQuota !== null && userListingQuota <= 0)}
                                    title={userListingQuota !== null && userListingQuota <= 0 ? "You have no available listings" : ""}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Property'}
                                </button>
                            </DialogTrigger>
                            <DialogContent className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full z-50">
                                <DialogTitle className="text-lg font-semibold mb-4">Confirm Submission</DialogTitle>
                                <p className="mb-6 text-sm text-gray-600">
                                    Are you sure you want to submit this property? Please confirm.
                                </p>
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition" disabled={isSubmitting}>Cancel</button>
                                    <button
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={isSubmitting || (userListingQuota !== null && userListingQuota <= 0)}
                                        className="px-4 py-2 rounded bg-[#2180d3] text-white hover:bg-[#1a6cb2] transition"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Confirm'}
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </form>
        </div>
    )
}