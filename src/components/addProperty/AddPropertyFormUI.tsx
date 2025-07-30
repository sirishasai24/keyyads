import { FieldErrors, UseFormRegister, UseFormWatch, UseFormGetValues } from 'react-hook-form';
import { FormValues } from './AddPropertyForm';

// Import the new components
import OwnerDetailsStep from './steps/OwnerDetailsStep';
import PropertyDetailsStep from './steps/PropertyDetailsStep';
import ImageUploadStep from './steps/ImageUploadStep';
import MapSelectorStep from './steps/MapSelectorStep';
import ReviewStep from './steps/ReviewStep';

type FormStepsProps = {
    currentStep: number;
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    watch: UseFormWatch<FormValues>;
    images: string[];
    uploading: boolean;
    handleImageUpload: (files: FileList | null) => Promise<void>;
    handleRemoveImage: (index: number) => void;
    location: { lat: number; lng: number };
    setLocation: (location: { lat: number; lng: number }) => void;
    getValues: UseFormGetValues<FormValues>;
    formatReviewValue: (value: string | number | null | undefined, placeholder?: string) => string | number | undefined;
};

const FormSteps = ({
    currentStep,
    register,
    errors,
    watch,
    images,
    uploading,
    handleImageUpload,
    handleRemoveImage,
    location,
    setLocation,
    getValues,
    formatReviewValue,
}: FormStepsProps) => {
    const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2180d3] shadow-sm';
    const errorClass = 'border-red-500 focus:ring-red-500';

    switch (currentStep) {
        case 0:
            return (
                <OwnerDetailsStep
                    register={register}
                    errors={errors}
                    inputClass={inputClass}
                    errorClass={errorClass}
                />
            );
        case 1:
            return (
                <PropertyDetailsStep
                    register={register}
                    errors={errors}
                    watch={watch}
                    inputClass={inputClass}
                    errorClass={errorClass}
                />
            );
        case 2:
            return (
                <ImageUploadStep
                    images={images}
                    uploading={uploading}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    errors={errors}
                />
            );
        case 3:
            return (
                <MapSelectorStep
                    location={location}
                    setLocation={setLocation}
                    errors={errors}
                />
            );
        case 4:
            return (
                <ReviewStep
                    getValues={getValues}
                    location={location}
                    images={images}
                    formatReviewValue={formatReviewValue}
                />
            );
        default:
            return null;
    }
};

export default FormSteps;