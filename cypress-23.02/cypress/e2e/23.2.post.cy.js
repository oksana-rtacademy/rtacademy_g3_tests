import { utilsResponse } from "./lib/utilsResponse";
import { utilsUser }     from "./lib/utilsUser";
import { utilsFunc }     from "./lib/utilsFunc";
import { faker }         from "@faker-js/faker";

describe( 'Пост', () =>
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

    it( 'Додати пост', () =>
    {
        cy.intercept( 'GET', '**/post_add.php' )
            .as( 'postAddPage' );

        cy.get( '#user-area-add-post' )
            .should( 'be.visible' )
            .focus()
            .click();

        let pageLoadStart = new Date().getTime();

        cy.wait( '@postAddPage' )
            .should( ( { response } ) =>
                utilsResponse.checkTimeoutContentTypeStatus(
                    response, pageLoadStart, timeoutDefault, 'checkHTML'
                )
            );

        cy.intercept( 'POST', '**/post_add.php' )
            .as( 'postAddPagePost' );

        const time = new Date().getTime(),
            name = faker.word.noun(),
            title = name + ' ' + time,
            description = faker.lorem.sentence(),
            content = faker.lorem.sentences( 4 ),
            publishDate = '2022-08-12T12:24',
            postCategoryTitle = 'PC',
            postCategoryValue = 1,
            postFilePath = utilsFunc.getElemInArray( Cypress.env( 'images' ) ),
            postStatus = 'Активний',
            postStatusValue = 201;

        cy.get( 'body > footer > div > div:nth-child(2) > ul > li:nth-child(1)' )
            .should( 'be.visible' );

        cy.get( '#form-post-title' )
            .should( 'be.visible' )
            .focus()
            .clear()
            .type( title, { delay: 10 } )
            .should( 'have.value', title );

        cy.get( '#form-post-description' )
            .should( 'be.visible' )
            .focus()
            .clear()
            .type( description, { delay: 10 } )
            .should( 'have.value', description );

        cy.get( '#form-post-content' )
            .should( 'be.visible' )
            .focus()
            .clear()
            .type( content )
            .should( 'have.value', content );

        cy.get( '#form-post-publish-date' )
            .should( 'be.visible' )
            .focus()
            .clear()
            .type( publishDate )
            .should( 'have.value', publishDate );

        cy.get( '#form-post-category' )
            .should( 'be.visible' )
            .focus()
            .select( postCategoryTitle )
            .should( 'have.value', postCategoryValue );

        cy.get( '#form-post-cover' )
            .should( 'be.visible' )
            .focus()
            .selectFile( postFilePath );

        cy.get( '#form-post-status' )
            .should( 'be.visible' )
            .focus()
            .select( postStatus )
            .should( 'have.value', postStatusValue );

        cy.get( '#form-post-submit' )
            .should( 'be.visible' )
            .focus()
            .click();

        const postAddTimeout = parseInt( Cypress.env( 'timeouts' ).postAdd );

        cy.wait( '@postAddPagePost' )
            .should( ( { response } ) =>
                utilsResponse.checkTimeoutContentTypeStatus(
                    response, pageLoadStart, postAddTimeout, 'checkHTML', 302
                )
            );

        // cy.screenshot( { overwrite: true } );

        cy.get( 'main > article div > h1' )
            .should( 'contain', title );

        cy.visit(
            baseUrl,
            {
                timeout: timeoutDefault
            }
        );

        cy.get( 'main.main-posts > div.posts > article:nth-child(1) > a.title' )
            .should( 'be.visible' )
            .should( 'contain', title )
            .click();

        // TODO: page load time
        // TODO: http status
    } );
} );


