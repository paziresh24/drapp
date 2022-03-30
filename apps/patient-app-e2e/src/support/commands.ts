// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
        login(): void;
        getTestId(selector: string): Chainable<HTMLElement>;
        findTestId(selector: string): Chainable<HTMLElement>;
    }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', () => {
    cy.setCookie(
        'certificate',
        '%242y%2410%24Kv8nHRsX96AN58wqULwMz.X7G1SPrnnFklPG0DxVbIyVNChHDgWxS'
    );
    cy.setCookie('P24SESSION', '7lf1egf7eg6chj4qauu7v1lu9s');
});

Cypress.Commands.add('getTestId', (selector, ...args) => {
    return cy.get(`[data-testid=${selector}]`, ...args);
});

Cypress.Commands.add('findTestId', (selector, ...args) => {
    return cy.find(`[data-testid=${selector}]`, ...args);
});
