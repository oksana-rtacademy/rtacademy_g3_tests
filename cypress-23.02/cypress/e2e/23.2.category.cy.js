import { utilsResponse } from "./lib/utilsResponse";
import { utilsUser }     from "./lib/utilsUser";
import { faker }         from "@faker-js/faker";

describe( 'Категорія', () =>
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
            .its( 'contentType' ).should( 'eq', 'text/html' );
    } );

    it( 'Додати категорію', () =>
    {
        cy.intercept( 'GET', '**/category_add.php' )
            .as( 'categoryAddPage' );

        cy.get( '#user-area-add-category' )
            .should( 'be.visible' )
            .focus()
            .click();

        let pageLoadStart = new Date().getTime();

        cy.wait( '@categoryAddPage' )
            .should( ( { response } ) =>
                utilsResponse.checkTimeoutContentTypeStatus(
                    response, pageLoadStart, timeoutDefault, 'checkHTML'
                )
            );

        cy.intercept( 'POST', '**/category_add.php' )
            .as( 'categoryAddPagePost' );

        const time = new Date().getTime(),
            name = faker.word.noun(),
            title = name + ' ' + time,
            alias = name + '-' + time,
            message = 'Категорію "' + title + '" успішно додано';

        cy.get( 'body > footer > div > div:nth-child(2) > ul > li:nth-child(1)' )
            .should( 'be.visible' );

        cy.get( '#form-category-title' )
            .should( 'be.visible' )
            .focus()
            .clear()
            .type( title, { delay: 10 } )
            .should( 'have.value', title );

        cy.get( '#form-category-alias' )
            .should( 'be.visible' )
            .focus()
            .should( 'have.value', alias );

        cy.get( '#form-category-submit' )
            .should( 'be.visible' )
            .focus()
            .click();

        pageLoadStart = new Date().getTime();

        cy.wait( '@categoryAddPagePost' )
            .should( ( { response } ) =>
                utilsResponse.checkTimeoutContentTypeStatus(
                    response, pageLoadStart, timeoutDefault, 'checkHTML'
                )
            );

        cy.get( '.main-form .success-general-text' )
            .should( 'contain', message );

        // cy.screenshot( { overwrite: true } );
    } );
} );


