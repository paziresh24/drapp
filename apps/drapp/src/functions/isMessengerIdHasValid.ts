export const isMessengerIdHasValid = (id: any) => {     
    return /^[a-zA-Z0-9_]{3,32}$/g.test(id);
};
