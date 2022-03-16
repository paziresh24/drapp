describe('patient-app', () => {
    beforeEach(() => {
        cy.login();
        cy.viewport(414, 896);
        cy.visit('/appointments');
        cy.intercept('GET', '/api/books?page=*', { statusCode: 200, fixture: 'turn/list' }).as(
            'turns'
        );
        cy.wait('@turns');
    });

    it('should display correct tag status', () => {
        cy.getTestId('turn-card').eq(0).find('[data-testid=tag-status]').contains('درخواست');
        cy.getTestId('turn-card').eq(1).find('[data-testid=tag-status]').contains('رد شده');
        cy.getTestId('turn-card').eq(4).find('[data-testid=tag-status]').contains('ویزیت شده');
        cy.getTestId('turn-card').eq(5).find('[data-testid=tag-status]').contains('منقضی');
        cy.getTestId('turn-card').eq(6).find('[data-testid=tag-status]').contains('حذف شده');
    });

    it('should remove turn', () => {
        cy.intercept('POST', '/api/deleteBook', {
            statusCode: 200,
            fixture: 'turn/remove'
        }).as('deleteTurn');

        cy.getTestId('turn-card').eq(2).find('[data-testid=turn-drop-down-button]').click();
        cy.getTestId('drop-down__remove-button').click();
        cy.getTestId('modal__remove-turn-button').click();
    });

    it('should un success remove turn and show error', () => {
        cy.intercept('POST', '/api/deleteBook', {
            statusCode: 200,
            fixture: 'turn/remove.error'
        }).as('deleteTurn');

        cy.getTestId('turn-card').eq(2).find('[data-testid=turn-drop-down-button]').click();
        cy.getTestId('drop-down__remove-button').click();
        cy.getTestId('modal__remove-turn-button').click();
        cy.get('.Toastify__toast-body > :nth-child(2)').contains('خطایی رخ داده است');
    });

    it('should cancel remove turn', () => {
        cy.getTestId('turn-card').eq(2).find('[data-testid=turn-drop-down-button]').click();
        cy.getTestId('drop-down__remove-button').click();
        cy.getTestId('modal__cancel-remove-turn-button').click();
    });

    it('should show queue button', () => {
        cy.getTestId('turn-card')
            .eq(2)
            .find('[data-testid=footer__queue_button]')
            .should('be.visible');
    });

    it('should show turn number queue', () => {
        cy.intercept('POST', '/api/addBookToQueue', { fixture: 'turn/queue' });
        cy.getTestId('turn-card').eq(2).find('[data-testid=footer__queue_button]').click();
        cy.getTestId('queue__booking-number').contains('19');
        cy.getTestId('queue__booking-text').contains('19');
        cy.getTestId('queue__booking-attendance-time').contains('21:40');
        cy.getTestId('queue__booking-waiting').contains('1');
        cy.getTestId('queue__acceptance-number').contains('10');
        cy.getTestId('queue__acceptance-text').contains('10');
    });
});
