describe('drapp', () => {
  beforeEach(() => cy.visit('/auth'));

  it('should successful login with salamat', async () => {
    cy.getByTestId('change-login-with-salamat').click();
    cy.getByTestId('salamat-login-username-field').type('drnosratian');
    cy.getByTestId('salamat-login-password-field').type('Majid1366'); 
    cy.getByTestId('salamat-login-login-button').click();
    cy.intercept('POST', '/V1/salamat-auth/login').as('login');
    cy.wait('@login').then((xhr) => {
      expect(window.localStorage.getItem('token')).to.eq(xhr.response.body.access_token);;  
    });
  });
});
