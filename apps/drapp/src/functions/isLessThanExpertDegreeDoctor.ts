interface Expertises {
    degree: {
        id: number;
    };
}

export const isLessThanExpertDegreeDoctor = (expertises: Array<Expertises>) => {
    const lessThanExpertDegree = ['1', '2', '3', '4', '14', '15'];
    return (
        expertises &&
        expertises.some(expertise =>
            lessThanExpertDegree.includes(expertise.degree?.id?.toString())
        )
    );
};
