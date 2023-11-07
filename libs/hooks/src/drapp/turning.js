import { useQuery, useMutation } from 'react-query';
import { turns } from '@paziresh24/apis/drApp/turning/turns';
import { pagingStatistics } from '@paziresh24/apis/drApp/turning/paging';
import { pagingNext } from '@paziresh24/apis/drApp/turning/paging/next';
import { addNewBook } from '@paziresh24/apis/drApp/turning/addNewBook';
import { deleteTurns } from '@paziresh24/apis/drApp/turning/deleteTurns';
import { removeTurn } from '@paziresh24/apis/drApp/turning/removeTurn';
import { moveTurns } from '@paziresh24/apis/drApp/turning/moveTurns';
import { came } from '@paziresh24/apis/drApp/turning/status/came';
import { paziresh } from '@paziresh24/apis/drApp/turning/status/paziresh';
import { vacation } from '@paziresh24/apis/drApp/turning/vacation/index';
import { getVacation } from '@paziresh24/apis/drApp/turning/vacation/get';
import { deleteVacation } from '@paziresh24/apis/drApp/turning/vacation/delete';
import { changeVacation } from '@paziresh24/apis/drApp/turning/vacation/change';

const useGetTurns = param => {
    return useQuery(['turns', param], () => turns(param), {
        enabled: false
    });
};

const useGetPagingStatistics = param => {
    return useQuery(['pagingStatistics', param], () => pagingStatistics(param));
};

const useGetPagingNext = param => {
    return useQuery(['pagingNext', param], () => pagingNext(param), {
        enabled: false
    });
};

const useAddNewBook = () => {
    return useMutation(addNewBook);
};

const useDeleteTurns = () => {
    return useMutation(deleteTurns);
};

const useRemoveTurn = () => {
    return useMutation(removeTurn);
};

const useMoveTurns = () => {
    return useMutation(moveTurns);
};

const useCame = () => {
    return useMutation(came);
};

const usePaziresh = () => {
    return useMutation(paziresh);
};

const useVacation = () => {
    return useMutation(vacation);
};

const useGetVacation = (params, options) => {
    return useQuery(['getVacation', params], () => getVacation(params), { ...options });
};

const useDeleteVacation = () => {
    return useMutation(deleteVacation);
};

const useChangeVacation = () => {
    return useMutation(changeVacation);
};

export {
    useGetTurns,
    useGetPagingStatistics,
    useRemoveTurn,
    useGetPagingNext,
    useAddNewBook,
    useDeleteTurns,
    useMoveTurns,
    useCame,
    usePaziresh,
    useVacation,
    useGetVacation,
    useDeleteVacation,
    useChangeVacation
};
