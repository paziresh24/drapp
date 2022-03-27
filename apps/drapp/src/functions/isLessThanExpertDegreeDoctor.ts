interface Expertise {
    degree: {
        id: number;
    };
}

export const isLessThanExpertDegreeDoctor = (expertises: Array<Expertise>) => {
    const lessThanExpertDegreeIds = ['1', '2', '3', '4', '14', '15'];
    return (
        expertises &&
        expertises.every(expertise =>
            lessThanExpertDegreeIds.includes(expertise.degree?.id?.toString())
        )
    );
};
