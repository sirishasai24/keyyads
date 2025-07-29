import { FieldErrors, UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import { FormValues } from '../AddPropertyForm';

type OwnerDetailsStepProps = {
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    inputClass: string;
    errorClass: string;
};

const OwnerDetailsStep = ({ register, errors, inputClass, errorClass }: OwnerDetailsStepProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Owner Name <span className="text-red-500">*</span></label>
                <input
                    id="username"
                    {...register('username', { required: 'Owner name is required' })}
                    placeholder="Owner Name"
                    className={clsx(inputClass, errors.username && errorClass)}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                <p className="text-xs text-gray-500 mt-1">Enter full name of property owner.</p>
            </div>
            <div>
                <label htmlFor="contact" className="block text-gray-700 text-sm font-medium mb-2">Contact Number <span className="text-red-500">*</span></label>
                <input
                    id="contact"
                    {...register('contact', {
                        required: 'Contact number is required',
                        pattern: {
                            value: /^\d{10}$/,
                            message: 'Please enter a valid 10-digit contact number'
                        },
                        min: { value: 0, message: 'Contact number cannot be negative' }
                    })}
                    placeholder="Contact Number"
                    type="tel"
                    className={clsx(inputClass, errors.contact && errorClass)}
                />
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
                <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number.</p>
            </div>
        </div>
    );
};

export default OwnerDetailsStep;