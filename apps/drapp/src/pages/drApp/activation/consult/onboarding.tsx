import { Button, Container } from '@mui/material';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useHistory } from 'react-router-dom';

export const Onboarding = () => {
    const router = useHistory();

    const videoIfram =
        '<style>.h_iframe-aparat_embed_frame{position:relative;}.h_iframe-aparat_embed_frame .ratio{display:block;width:100%;height:auto;}.h_iframe-aparat_embed_frame iframe{position:absolute;top:0;left:0;width:100%;height:100%;}</style><div class="h_iframe-aparat_embed_frame"><span style="display: block;padding-top: 57%"></span><iframe src="https://www.aparat.com/video/video/embed/videohash/s9xqF/vt/frame?recom=self"  allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe></div>';

    const handleContinueButton = () => {
        getSplunkInstance().sendEvent({
            group: 'drapp-visit-online',
            type: 'onboarding',
            event: {
                action: 'accept'
            }
        });
        router.push(
            router.location.search === '?active_doctor'
                ? '/profile/?active_doctor'
                : `/activation/consult/messengers`
        );
    };
    return (
        <>
            <Container
                maxWidth="sm"
                className="flex flex-col h-full pt-4 space-y-5 bg-white rounded-md md:h-auto md:p-5 md:mt-8 md:shadow-2xl md:shadow-slate-300"
            >
                <span className="block w-full p-2 font-medium text-center">
                    ویدیو آموزشی پزشک ویزیت آنلاین پذیرش۲۴
                </span>
                <div
                    className="overflow-scroll md:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: videoIfram }}
                />
                {/* <FixedWrapBottom className="border-t border-solid !bottom-0 border-[#e8ecf0]"> */}
                <Button fullWidth variant="contained" size="large" onClick={handleContinueButton}>
                    ادامه
                </Button>
                {/* </FixedWrapBottom> */}
            </Container>
        </>
    );
};

export default Onboarding;
