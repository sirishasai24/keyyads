import dynamic from 'next/dynamic'
import { FieldErrors } from 'react-hook-form';
import { FormValues } from '../AddPropertyForm';

const MapSelector = dynamic(() => import('@/components/addProperty/MapSelector'), { ssr: false })

type MapSelectorStepProps = {
    location: { lat: number; lng: number };
    setLocation: (location: { lat: number; lng: number }) => void;
    errors: FieldErrors<FormValues>;
};

const MapSelectorStep = ({ location, setLocation, errors }: MapSelectorStepProps) => {
    return (
        <div className="bg-[#eaf4fa] p-4 rounded-lg border border-[#2180d3]">
            <MapSelector
                location={location}
                onChange={(latlng) => {
                    setLocation(latlng);
                }}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            <p className="mt-2 text-sm text-gray-600">
                <strong>Coordinates:</strong>{' '}
                <span className="text-[#2180d3]">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
            </p>
        </div>
    );
};

export default MapSelectorStep;