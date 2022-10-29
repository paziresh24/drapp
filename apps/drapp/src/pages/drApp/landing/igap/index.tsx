import Button from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useDrApp } from '@paziresh24/context/drapp';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useVisitChannle } from 'apps/drapp/src/apis/onlineVisit/visitChannels';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import igapLogo from './logo.png';
import onboard from './onboard.jpg';
import axios from 'axios';

export const IgapLanding = () => {
    const router = useHistory();
    const [{ doctor }] = useDrApp();
    const channle = useVisitChannle();
    const [username, setUsername] = useState('');

    const handleSaveChannle = () => {
        if (!username.trim()) {
            return toast.error('لطفا نام کاربری خود را وارد کنید.');
        }
        channle.mutate(
            {
                type: 'igap',
                channel: username
            },
            {
                onSuccess: () => {
                    toast.success('نام کاربری شما با موفقیت ثبت شد.');
                    getSplunkInstance().sendEvent({
                        group: 'iGap',
                        type: 'save'
                    });
                    router.push('/');
                },
                onError: error => {
                    if (axios.isAxiosError(error)) toast.error(error.response?.data?.message);
                }
            }
        );
    };

    const handleClickDownloadButton = () => {
        getSplunkInstance().sendEvent({
            group: 'iGap',
            type: 'download-iGap'
        });
        window.open('https://igap.net/#download');
    };

    const handleClickUsernameInput = () => {
        getSplunkInstance().sendEvent({
            group: 'iGap',
            type: 'username'
        });
    };

    return (
        <div className="bg-white">
            <div className="flex flex-col p-5 space-y-4">
                <p className="text-center font-semibold">
                    دکتر {doctor.name} {doctor.family} عزیز
                </p>
                <p>2500 بیمار از عدم ارسال مدارک پزشکی در ویزیت آنلاین شکایت داشتند!</p>
                <div className="flex flex-col p-3 space-y-2 text-sm font-medium leading-6 rounded-lg bg-orange-50">
                    <span className="text-stone-600">
                        طبق نظرسنجی های انجام شده؛ در شرایط فعلی پیام رسان آی گپ بهترین گزینه در
                        دسترس می باشد.
                    </span>
                    <span className="text-stone-600">
                        لازم به ذکر است که در زمان نوبت بیمار؛ تماس تلفنی برقرار خواهد شد و پیام
                        رسان آی گپ را فقط برای ارسال تصاویر و مستندات در نظر گرفته ایم.
                    </span>
                </div>
                <p>
                    برای نصب آی گپ برای روی دکمه زیر کلیک نمایید و ثبت نام را با شماره ای که در واتس
                    اپ بیزینس عضویت داشتید انجام دهید.
                </p>
                <div
                    onClick={handleClickDownloadButton}
                    className="flex flex-col items-center self-center justify-center px-8 py-3 font-bold rounded-lg bg-stone-200"
                >
                    <img src={igapLogo} alt="" width={80} />
                </div>
                <p>
                    پس از نصب آی گپ، مطابق تصویر زیر به آی گپ خود وارد شوید و در قسمت"پروفایل"، نام
                    کاربری پیش فرض را پاک نمایید و سپس نام کاربری مورد نظر خود را بنویسید و در نهایت
                    آن را کپی کرده و در کادر زیر وارد نمایید.
                </p>
                <img src={onboard} alt="" width={300} className="self-center rounded-2xl" />
                <p>لطفا نام کاربریiGap خود را در کادر زیر وارد نمایید.</p>
                <TextField
                    placeholder="username"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        style: {
                            direction: 'ltr'
                        }
                    }}
                    inputProps={{
                        style: {
                            direction: 'ltr'
                        }
                    }}
                    onChange={e => setUsername(e.target.value)}
                    onClick={handleClickUsernameInput}
                />
                <Button onClick={handleSaveChannle} loading={channle.isLoading} variant="contained">
                    ذخیره
                </Button>
            </div>
        </div>
    );
};

export default IgapLanding;
