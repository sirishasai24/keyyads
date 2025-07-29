import { FieldErrors } from 'react-hook-form';
import { FormValues } from '../AddPropertyForm';

type ImageUploadStepProps = {
    images: string[];
    uploading: boolean;
    handleImageUpload: (files: FileList | null) => Promise<void>;
    handleRemoveImage: (index: number) => void;
    errors: FieldErrors<FormValues>;
};

const ImageUploadStep = ({
    images,
    uploading,
    handleImageUpload,
    handleRemoveImage,
    errors,
}: ImageUploadStepProps) => {
    return (
        <div className="bg-gray-50 border-2 border-dashed rounded-xl p-6 text-center">
            <label className="block text-gray-700 font-medium mb-2">Upload Property Images <span className="text-red-500">*</span></label>
            <input
                type="file"
                multiple
                accept="image/*"
                className="block mx-auto text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#2180d3] file:text-white hover:file:bg-[#1a6cb2]"
                onChange={(e) => handleImageUpload(e.target.files)}
            />
            {uploading && <p className="text-sm text-gray-500 mt-3">Uploading...</p>}
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
                {images.map((img, i) => (
                    <div key={i} className="relative">
                        <img src={img} className="w-24 h-24 object-cover rounded-lg shadow-md border" alt={`Property image ${i + 1}`} />
                        <button
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                            type="button"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
        </div>
    );
};

export default ImageUploadStep;