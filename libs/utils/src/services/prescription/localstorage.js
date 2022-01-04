export const GETـPRESCRIPTIONـTOKEN = () => {
    return localStorage.getItem(`prescription_token`);
};

export const SET_PRESCRIPTIONـTOKEN = token => {
    localStorage.setItem(`prescription_token`, token);
};

export const CLEAR_PRESCRIPTIONـTOKEN = () => {
    localStorage.removeItem(`prescription_token`);
};
