import { utilsResponse } from "./utilsResponse";

const utilsUser = {};

const baseUrl = Cypress.env( 'url' ).toString();

utilsUser.checkAuthCookie = () =>
{
    const cookieName = Cypress.env( 'cookieName' ).toString();

    cy.getCookie( cookieName )
        .should( 'exist' )
        .should( 'have.property', 'value' );
};

utilsUser.authorize = ( userAuthorizeData ) =>
{
    const { login, password, name } = userAuthorizeData;

    cy.session( [ login, password ], () =>
    {
        cy.visit( baseUrl );

        cy.get( 'footer .nav #user-area-login' )
            .should( 'be.visible' )
            .click();

        cy.get( '#form-user-login' )
            .should( 'be.visible' )
            .focus()
            .type( login, { delay: 10 } )
            .should( 'have.value', login );

        cy.get( '#form-user-password' )
            .should( 'be.visible' )
            .focus()
            .type( password, { delay: 10 } )
            .should( 'have.value', password );

        cy.get( '#form-user-submit' )
            .should( 'be.visible' )
            .focus()
            .click();

        cy.get( 'footer .nav ul li:first-child' )
            .should( 'contain', name );

        // перевірка існування авторизаційної кукі
        utilsUser.checkAuthCookie();
    } );
};

utilsUser.deAuthorize = () =>
{
    // Деавторизація
    cy.visit( baseUrl + 'logout.php' );

    // Очистка cookies
    cy.clearCookies();

    // Очистка LocalStorage
    cy.clearLocalStorage();
};

export default {
    utilsUser
};