'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form' // Import SubmitHandler
import { toast } from 'react-hot-toast'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import clsx from 'clsx'
import axios from 'axios'
import { cloudinaryUpload } from '@/lib/cloudinary' // Ensure this path is correct

import FormSteps from './AddPropertyFormUI' // This component will contain the steps, including PropertyDetailsStep

// Define the exact shape of your form values
export type FormValues = {
    username: string
    contact: string
    state: string // Direct field for state
    city: string  // Direct field for city
    address: string
    title: string
    type: 'building' | 'land'
    saleType: 'sale' | 'rent'
    landCategory?: 'Agricultural' | 'Residential' | 'Commercial'
    floors?: number
    bedrooms?: string // Use string for "6+"
    bathrooms?: string // Use string for "6+"
    propertyAge?: 'New' | '<5 Years' | '5-10 Years' | '>10 Years'
    furnishing?: 'Unfurnished' | 'Semi-furnished' | 'Fully-furnished'
    facing?: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West' | 'Not Specified'
    otherDetails?: string
    area: number // Must be a number
    areaUnit: 'sqft' | 'sqyd' | 'sqm' | 'acres' // Separate field for unit
    location: { lat: number; lng: number } // For map coordinates
    images: string[]
    description: string
    price: number // Must be a number
    discount?: number
    parking?: number
    isPremium: 'yes' | 'no' // Value from radio buttons
}

const center = { lat: 17.385044, lng: 78.486671 } // Surampalem's approximate coordinates

export default function AddPropertyForm() {
    const [images, setImages] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        getValues,
        formState: { errors, isValid } // Added isValid for overall form validity
    } = useForm<FormValues>({
        mode: "onTouched", // Validate on blur
        defaultValues: {
            type: 'land',
            saleType: 'sale',
            location: center, // Default to Surampalem coordinates
            images: [],
            areaUnit: 'sqft',
            isPremium: 'no',
            facing: 'Not Specified',
            state: '', // Initial empty string for dropdown
            city: ''  // Initial empty string for dropdown
        }
    })

    const selectedType = watch('type') // Watch property type to conditionally render fields

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

        await Promise.all(uploadPromises) // Wait for all uploads to complete

        const updatedImages = [...images, ...uploaded]
        setImages(updatedImages)
        setValue('images', updatedImages, { shouldValidate: true }) // Update RHF state and trigger validation
        setUploading(false)
        toast.success(`${uploaded.length} image(s) uploaded successfully!`);
    }

    const handleRemoveImage = (index: number) => {
        const updated = [...images]
        updated.splice(index, 1)
        setImages(updated)
        setValue('images', updated, { shouldValidate: true }) // Update RHF state and trigger validation
        toast('Image removed.', { icon: '🗑️' });
    }

    const steps = ['Owner Details', 'Property Info', 'Upload Images', 'Location', 'Review & Submit']

    const goToNextStep = async () => {
        let fieldsToValidate: (keyof FormValues)[] = []

        // Define fields to validate for each step
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
            fieldsToValidate = ['location'] // Assuming location includes lat/lng based on your map component
        }
        // No specific validation needed for step 4 (Review & Submit), as `handleSubmit(onSubmit)` will do it all

        const isStepValid = await trigger(fieldsToValidate, { shouldFocus: true }); // Focus on the first invalid field

        if (isStepValid) {
            setCurrentStep((prev) => prev + 1)
        } else {
            // Find the first field with an error and scroll to it
            const firstErrorField = fieldsToValidate.find(field => errors[field]);
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

    const onSubmit: SubmitHandler<FormValues> = async (formData) => { // Use formData directly from RHF
        setIsSubmitting(true)
        try {
            // Prepare data for the API call
            const dataToSubmit: any = { // Use 'any' temporarily for conditional deletions
                ...formData, // Start with all valid form data
            }

            // 1. Convert isPremium from 'yes'/'no' string to boolean
            dataToSubmit.isPremium = formData.isPremium === 'yes'

            // 2. Ensure area and price are numbers (they should be due to valueAsNumber: true)
            //    No need to concatenate area and areaUnit here; they are separate fields now.
            //    No need to convert price to string; it's a Number in schema.

            // 3. Handle 'facing' - send null if 'Not Specified'
            if (dataToSubmit.facing === 'Not Specified') {
                dataToSubmit.facing = null; // Backend expects null or undefined if not specified
            }

            // 4. Conditionally remove fields not relevant to the property type
            if (dataToSubmit.type === 'land') {
                // These fields are specific to 'building' type in the schema
                delete dataToSubmit.bedrooms
                delete dataToSubmit.bathrooms
                delete dataToSubmit.floors
                delete dataToSubmit.furnishing
                delete dataToSubmit.propertyAge
                delete dataToSubmit.otherDetails
                delete dataToSubmit.parking
            } else if (dataToSubmit.type === 'building') {
                // This field is specific to 'land' type in the schema
                delete dataToSubmit.landCategory
            }

            // 5. Ensure `images` array is not empty (already validated in `goToNextStep` for step 2, but good to double check)
            if (!dataToSubmit.images || dataToSubmit.images.length === 0) {
                toast.error('Please upload at least one image for the property.');
                setIsSubmitting(false);
                setCurrentStep(2); // Direct user back to image upload step
                return;
            }

            // Log final data before sending for debugging
            console.log('Sending data to API:', dataToSubmit)

            const response = await axios.post('/api/property/add', dataToSubmit)

            console.log('Form data submitted successfully:', response.data.data)
            toast.success('Property submitted successfully!')
            // Optionally reset the form and go back to the first step
            // reset();
            // setCurrentStep(0);
            setShowModal(false) // Close the modal on success
            // Optionally, redirect the user
            // router.push('/dashboard/my-properties');

        } catch (error) {
            console.error('Submission error:', error)
            if (axios.isAxiosError(error) && error.response) {
                // Handle API validation errors or other server responses
                const errorMessage = error.response.data.message || error.response.data.error || 'Something went wrong. Please try again.';
                toast.error(errorMessage);
                // If specific backend errors relate to a step, you can navigate there
                // Example: if (errorMessage.includes('image')) setCurrentStep(2);
                // if (errorMessage.includes('category')) setCurrentStep(1);
            } else {
                toast.error('Network error or unexpected error. Please try again.');
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper function for displaying review values
    const formatReviewValue = (value: string | number | null | undefined, placeholder: string = 'N/A') => {
        if (value === 'Not Specified' || value === null || value === undefined || value === '') {
            return placeholder
        }
        return value
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 mt-10 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#2180d3] mb-8">Add New Property</h1>

            {/* Stepper with integrated progress line */}
            <div className="flex flex-row justify-between mb-10 overflow-x-auto whitespace-nowrap relative">
                {/* Progress Line Track */}
                <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-300 z-0">
                    {/* Progress Line Fill */}
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
                        {/* The label is hidden on mobile and shown on larger screens */}
                        <span className={clsx('text-xs mt-2 text-center hidden sm:block', currentStep >= i ? 'text-[#2180d3]' : 'text-gray-400')}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form content, wrapped by a real form tag for accessibility but controlled by RHF's handleSubmit */}
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
                    location={getValues('location')} // Pass map location
                    setLocation={(latlng) => setValue('location', latlng, { shouldValidate: true })} // Update map location
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
                        // This button triggers the Dialog for final confirmation before submission
                        <Dialog open={showModal} onOpenChange={setShowModal}>
                            <DialogTrigger asChild>
                                <button type="button" className="bg-[#2180d3] text-white px-6 py-2 rounded-lg hover:bg-[#1a6cb2] transition" disabled={isSubmitting}>
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
                                        onClick={handleSubmit(onSubmit)} // This will trigger RHF validation and then call onSubmit
                                        disabled={isSubmitting}
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