import { useMutation } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export const uploadImage = async (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function (event: any) {
            const binaryData = event.target.result;
            console.log(event.target.result);

            await apiGatewayClient
                .post(`/v1/rokhnama/upload/image`, binaryData, {
                    headers: {
                        'Content-Type': file.type
                    }
                })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        };
        reader.readAsArrayBuffer(file);
    });
};

export const useUploadImage = () => useMutation(uploadImage);
