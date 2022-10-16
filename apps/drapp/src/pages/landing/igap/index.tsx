import { Button, InputAdornment, TextField } from '@mui/material';
import { useLayoutEffect } from 'react';
import igapLogo from './logo.png';
import onboard from './onboard.jpg';

export const IgapLanding = () => {
    useLayoutEffect;
    return (
        <div className="bg-white">
            <div className="flex items-center justify-center h-16 border-b border-solid border-slate-200">
                <span className="font-medium">ویزیت آنلاین</span>
            </div>
            <div className="flex flex-col p-5 space-y-4">
                <p className="text-center">دکتر آیدا عزیز</p>
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
                <div className="flex flex-col items-center self-center justify-center px-8 py-3 font-bold rounded-lg bg-stone-200">
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
                />
                <Button variant="contained">ذخیره</Button>
            </div>
        </div>
    );
};

export default IgapLanding;
