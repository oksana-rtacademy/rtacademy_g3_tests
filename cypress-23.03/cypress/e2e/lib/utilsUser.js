import { utilsResponse } from "./utilsResponse";
import * as OTPAuth from 'otpauth';

const utilsUser = {};

const baseUrl = Cypress.env( 'url' ).toString();

// utilsUser.checkAuthCookie = () =>
// {
//     const cookieName = Cypress.env( 'cookieName' ).toString();
//
//     cy.getCookie( cookieName )
//         .should( 'exist' )
//         .should( 'have.property', 'value' );
// };

utilsUser.authorize = ( userAuthorizeData ) =>
{
    // Create a new TOTP object.
    let totp = new OTPAuth.TOTP({
        issuer: 'ACME',
        label: 'AzureDiamond',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: 'T4YO  XPQN  XGIH  UTWK X3AM  OJHO  TARD  UKDM' // or "OTPAuth.Secret.fromBase32('NB2W45DFOIZA')"
    });

    // Generate a token.
    let token = totp.generate();

    // Validate a token.
    let delta = totp.validate({
        token: token,
        window: 1
    });

    // Convert to Google Authenticator key URI.
    // otpauth://totp/ACME:AzureDiamond?issuer=ACME&secret=NB2W45DFOIZA&algorithm=SHA1&digits=6&period=30
    let uri = totp.toString(); // or "OTPAuth.URI.stringify(totp)"

    // Convert from Google Authenticator key URI.
    let parsedTotp = OTPAuth.URI.parse(uri);

    const { login, password, name } = userAuthorizeData;

    // cy.session( [ login, password ], () =>
    // {
        cy.visit( baseUrl );

        cy.get( '.s4Iyt' )
            .should( 'be.visible' );

        cy.get( '#loginForm > div > div:nth-child(1) > div > label > input' )
            .should( 'be.visible' )
            .focus()
            .type( login, { delay: 10 } )
            .should( 'have.value', login );

        cy.get( '#loginForm > div > div:nth-child(2) > div > label > input' )
            .should( 'be.visible' )
            .focus()
            .type( password, { delay: 10 } )
            .should( 'have.value', password );

        cy.get( '#loginForm > div > div:nth-child(3) > button' )
            .should( 'be.visible' )
            .focus()
            .click();

    cy.get( '#react-root > section > main > article > div.rgFsT > div:nth-child(1) > div.FsQoP > form > div.gi2oZ > div > label > input' )
        .should( 'be.visible' )
        .focus()
        .type( parsedTotp, { delay: 10 } );

    // cy.get( 'footer .nav ul li:first-child' )
        //     .should( 'contain', name );

        // перевірка існування авторизаційної кукі
        //utilsUser.checkAuthCookie();
    // } );
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