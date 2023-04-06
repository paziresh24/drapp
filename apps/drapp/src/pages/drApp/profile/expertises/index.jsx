import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useForm } from 'react-hook-form';
import { useDoctorInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import Button from '@paziresh24/shared/ui/button';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import classNames from 'classnames';
import { ExpertisesWrapper } from 'apps/drapp/src/components/profile/expertisesWrapper';

export const Expertises = () => {
    const [info, setInfo] = useDrApp();
    const doctorInfoUpdate = useDoctorInfoUpdate();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    return (
        <div className="h-full p-4 space-y-3 flex flex-col bg-white">
            <ExpertisesWrapper />
        </div>
    );
};

export default Expertises;
