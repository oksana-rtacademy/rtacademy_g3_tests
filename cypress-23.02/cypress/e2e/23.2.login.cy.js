import { utilsResponse } from "./lib/utilsResponse";
import { utilsUser }     from "./lib/utilsUser";
import { faker }         from "@faker-js/faker";
import moment         from "moment";

describe( 'Логін', () =>
{
    let
        baseUrl,
        timeoutDefault,
        userAuthorizeData;

    before( () =>
    {
        baseUrl     = Cypress.env( 'url' ).toString();
        timeoutDefault  = parseInt( Cypress.env( 'timeouts' ).default );

        const users = Cypress.env( 'users' );
        userAuthorizeData = users[ Math.floor( Math.random() * users.length ) ];
    } );

    beforeEach( () =>
    {
        // авторизація (або відновлення сесії)
        utilsUser.authorize( userAuthorizeData );

        cy.visit(
            baseUrl,
            {
                timeout: timeoutDefault
            }
        );

        cy.document()
            .its( 'contentType' )
            .should( 'eq', 'text/html' );
    } );

    it( 'Авторизуватись', () => {} );

    it( 'Відкрити першу сторінку, перевірити що відображено 3 записи', () =>
    {
        cy.get( 'main.main-posts > div.posts article' )
            .should( 'be.visible' )
            .should( 'have.length', 3 );

        // cy.screenshot( { overwrite: true } );
    } );

} );


