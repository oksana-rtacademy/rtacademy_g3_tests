import { utilsResponse } from "./lib/utilsResponse";
import { utilsUser }     from "./lib/utilsUser";

describe( 'Дії без авторизації', () =>
{
    let baseUrl,
        timeoutDefault;

    before( () =>
    {
        baseUrl         = Cypress.env( 'url' ).toString();
        timeoutDefault  = parseInt( Cypress.env( 'timeouts' ).default );
    } );

    beforeEach( () =>
    {
        cy.visit(
            baseUrl,
            {
                timeout: timeoutDefault
            }
        );

        cy.document()
            .its( 'contentType' ).should( 'eq', 'text/html' );
    });

    it( 'Відкрити першу сторінку, перевірити що відображено 3 записи', () =>
    {
        cy.title()
            .should( 'eq' , Cypress.env( 'mainPageTitle' ) );

        cy.get( 'main.main-posts > div.posts article' )
            .should( 'be.visible' )
            .should( 'have.length', 3 );

        // cy.screenshot( { overwrite: true } );
    } );

    it( 'Відкрити першу сторінку, довантажити пости через "Load More"', () =>
    {
        cy.intercept( 'GET', '**/posts_ajax.php?page=2' )
            .as( 'postsLoadMore' );

        cy.get( '#load-more' )
            .should( 'be.visible' )
            .focus()
            .click();

        let pageLoadStart = new Date().getTime();

        cy.wait( '@postsLoadMore' )
            .should( ( { response } ) =>
                utilsResponse.checkTimeoutContentTypeStatus(
                    response, pageLoadStart, timeoutDefault, 'checkJSON'
                )
            );

        cy.get( 'main.main-posts > div.posts article' )
            .should( 'be.visible' )
            .should( 'have.length', 6 );

        // cy.screenshot( { overwrite: true } );
    } );

    it( 'Відкрити першу сторінку, довантажити пости через "Load More", відкрити будь-який та перевірити його', () =>
    {
        cy.intercept( 'GET', '**/posts_ajax.php?page=2' )
            .as( 'postsLoadMore' );

        cy.get( '#load-more' )
            .should( 'be.visible' )
            .focus()
            .click();

        let pageLoadStart = new Date().getTime();

        cy.wait( '@postsLoadMore' )
            .should( ( { response } ) =>
                utilsResponse.checkTimeoutContentTypeStatus(
                    response, pageLoadStart, timeoutDefault, 'checkJSON'
                )
            );

        cy.get( 'main.main-posts > div.posts > article:nth-child(5) > a.title' )
            .then(
                ( elem ) =>
                {
                    return {
                        'url': elem.get(),
                        'title': elem.text(),
                    };
                }
            ).then(
            ( articleData ) =>
            {
                cy.intercept( 'GET', '**/single.php?id=6' )
                    .as( 'postLoadPage' );

                cy.get( 'main.main-posts > div.posts > article:nth-child(5) > a.title' )
                    .should( 'be.visible' )
                    .focus()
                    .click();

                pageLoadStart = new Date().getTime();

                cy.wait( '@postLoadPage' )
                    .should( ( { response } ) =>
                        utilsResponse.checkTimeoutContentTypeStatus(
                            response, pageLoadStart, timeoutDefault, 'checkHTML'
                        )
                    );

                cy.get( 'main > article div > h1' )
                    .should( 'contain.text', articleData.title );

                cy.url()
                    .should( 'include', articleData.url )
            }
        );
        // cy.screenshot( { overwrite: true } );
    } );
} );


