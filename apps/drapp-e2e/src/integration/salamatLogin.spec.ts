describe('drapp', () => {
    beforeEach(() => cy.visit('/auth'));

    it('should successful login with salamat', async () => {
        cy.getByTestId('change-login-with-salamat').click();
        cy.getByTestId('salamat-login-username-field').type('testUsername');
        cy.getByTestId('salamat-login-password-field').type('testPass');
        cy.getByTestId('salamat-login-login-button').click();
        cy.intercept('POST', '/V1/salamat-auth/login', { fixture: 'salamatAuthenticatedUser' }).as(
            'login'
        );
        cy.wait('@login').then(() => {
            expect(window.localStorage.getItem('token')).to.eq('faketoken');
        });
    });

    it('should successful create center then login with salamat', async () => {
        cy.intercept('POST', '/V1/doctor/center/ignoreShahkar', {
            fixture: 'createCenterSuccess'
        }).as('createCenter');
        let interceptCount = 0;

        cy.intercept('POST', '/V1/salamat-auth/login', req => {
            req.reply(res => {
                if (interceptCount === 0) {
                    console.log(interceptCount);
                    res.send({ fixture: 'salamatUnAuthenticatedUser', statusCode: 404 });
                    interceptCount = 1;
                } else {
                    res.send({ fixture: 'salamatAuthenticatedUser', statusCode: 200 });
                    // interceptCount = 0;
                }
            });
        }).as('login');
        cy.getByTestId('change-login-with-salamat').click();
        cy.getByTestId('salamat-login-username-field').type('testUsername');
        cy.getByTestId('salamat-login-password-field').type('testPass');
        cy.getByTestId('salamat-login-login-button').click();

        cy.wait('@login');
        cy.getByTestId('create-center-cell-phone-field').type('09122222222');
        cy.getByTestId('create-center-national-code-field').type('1111111111');
        cy.getByTestId('create-center-submit-button').click();

        cy.wait('@createCenter').then(() => {
            cy.wait('@login').then(() => {
                expect(window.localStorage.getItem('token')).to.eq('faketoken');
            });
        });
    });
});
