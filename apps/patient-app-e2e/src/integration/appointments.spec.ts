import { getGreeting } from '../support/app.po';

describe('patient-app', () => {
    beforeEach(() => {
        cy.setCookie(
            'certificate',
            '%242y%2410%24Kv8nHRsX96AN58wqULwMz.X7G1SPrnnFklPG0DxVbIyVNChHDgWxS'
        );
        cy.setCookie('P24SESSION', '7lf1egf7eg6chj4qauu7v1lu9s');
        cy.visit('/appointments');
    });

    it('should display welcome message', () => {
        // Custom command example, see `../support/commands.ts` file
        cy.login('my-email@something.com', 'myPassword');

        // Function helper example, see `../support/app.po.ts` file
        getGreeting().contains('Welcome patient-app');
    });
});
