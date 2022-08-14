import { utilsResponse } from "./lib/utilsResponse";
import { utilsUser }     from "./lib/utilsUser";
import { faker }         from "@faker-js/faker";
import moment         from "moment";

describe( '#23.2', () =>
{
    describe.skip( 'Дії без авторизації', () =>
    {
        let baseUrl;

        before( () =>
        {
            baseUrl = Cypress.env( 'url' ).toString();
        } );

        beforeEach( () =>
        {
            cy.visit( baseUrl );
        });

        it( 'Відкрити першу сторінку, перевірити що відображено 3 записи', () =>
        {
            const page =
                {
                    "title": "Gaming News",
                };

            cy.title()
                .should( 'include' , page.title );

            cy.get( 'main.main-posts > div.posts article' )
                .should( 'be.visible' )
                .should( 'have.length', 3 );

            //cy.screenshot();
        } );

        it( 'Відкрити першу сторінку, довантажити пости через "Load More"', () =>
        {
            cy.intercept( 'GET', '**/posts_ajax.php?page=2' ).as( 'postsLoadMore' );

            cy.get( '#load-more' )
                .should( 'be.visible' )
                .click();

            cy.wait( '@postsLoadMore' ).should(
                ( { request, response } ) =>
                {
                    utilsResponse.checkJSON( response );
                    utilsResponse.checkHttpStatus( response );
                    expect( response.body ).to.have.length( 3 );
                }
            );

            cy.get( 'main.main-posts > div.posts article' )
                .should( 'be.visible' )
                .should( 'have.length', 6 );

            //cy.screenshot();
        } );

        it( 'Відкрити першу сторінку, довантажити пости через "Load More", відкрити будь-який та перевірити його', () =>
        {
            cy.intercept( 'GET', '**/posts_ajax.php?page=2' ).as( 'postsLoadMore' );

            cy.get( '#load-more' )
                .should( 'be.visible' )
                .focus()
                .click();

            cy.wait( '@postsLoadMore' ).should(
                ( { request, response } ) =>
                {
                    utilsResponse.checkJSON( response );
                    utilsResponse.checkHttpStatus( response );
                    expect( response.body ).to.have.length( 3 );
                }
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
                    cy.get( 'main.main-posts > div.posts > article:nth-child(5) > a.title' )
                        .should( 'be.visible' )
                        .click();

                    cy.get( 'main > article div > h1' )
                        .should( 'contain.text', articleData.title );

                    cy.url()
                        .should( 'include', articleData.url )
                }
            );

            //cy.screenshot();
        } );
    } );

    describe( 'Дії з авторизацією', () =>
    {
        let baseUrl;

        before( () =>
        {
            baseUrl = Cypress.env( 'url' ).toString();
        } );

        beforeEach( () =>
        {
            cy.visit( baseUrl );
            utilsUser.authorize();
        });

        it.skip( 'Відкрити першу сторінку, перевірити що відображено 3 записи', () =>
        {
            cy.get( 'main.main-posts > div.posts article' )
                .should( 'be.visible' )
                .should( 'have.length', 3 );

            //cy.screenshot();
        } );

        it.only( 'Додати категорію', () =>
        {
            cy.log( cy.document() );
            cy.document().its('contentType').should('eq', 'text/html');
            cy.document().its('statusCode').should('eq', 'text/html');
            const time = new Date().getTime(),
                name = faker.word.noun(),
                title = name + ' ' + time,
                alias = name + '-' + time,
                message = 'Категорію "' + title + '" успішно додано';

            cy.get( 'body > footer > div > div:nth-child(2) > ul > li:nth-child(1)' )
                .should( 'be.visible' );

            cy.get( '#user-area-add-category' )
                .should( 'be.visible' )
                .focus()
                .click();

            cy.get( '#form-category-title' )
                .should( 'be.visible' )
                .focus()
                .clear()
                .type( title );

            cy.get( '#form-category-alias' )
                .should( 'be.visible' )
                .focus()
                .clear()
                .type( alias );

            cy.get( '#form-category-submit' ).should( 'be.visible' ).click();

            cy.get( '.success-general-text' )
                .should( 'be.visible' )
                .should( 'contain', message )

            //cy.screenshot();
        } );

        it( 'Додати пост', () =>
        {
            const time = new Date().getTime(),
                name = faker.word.noun(),
                title = name + ' ' + time,
                description = faker.lorem.sentence(),
                content = faker.lorem.sentences( 5 ),
                //publishDate = moment().format( 'YYYY-MM-DDTHH:mm' ),
                publishDate = '2022-08-12T12:24',
                postCategoryTitle = 'PC',
                postStatus = 'Активний',
                postFilePath = 'attach/1.jpg';

            cy.get( 'body > footer > div > div:nth-child(2) > ul > li:nth-child(1)' )
                .should( 'be.visible' );

            cy.get( '#user-area-add-post' )
                .should( 'be.visible' )
                .focus()
                .click();

            cy.get( '#form-post-title' )
                .should( 'be.visible' )
                .focus()
                .clear()
                .type( title );

            cy.get( '#form-post-description' )
                .should( 'be.visible' )
                .focus()
                .clear()
                .type( description );

            cy.get( '#form-post-content' )
                .should( 'be.visible' )
                .focus()
                .clear()
                .type( content );

            cy.get( '#form-post-publish-date' )
                .should( 'be.visible' )
                .focus()
                .type( publishDate );

            cy.get( '#form-post-category' )
                .should( 'be.visible' )
                .focus()
                .select( postCategoryTitle );

            cy.get( '#form-post-cover' )
                .should( 'be.visible' )
                .focus()
                .selectFile( postFilePath );

            cy.get( '#form-post-status' )
                .should( 'be.visible' )
                .focus()
                .select( postStatus );

            cy.get( '#form-post-submit' )
                .should( 'be.visible' )
                .focus()
                .click();

            cy.get( 'h1' )
                .should( 'be.visible' )
                .should( 'contain', title )

            //cy.screenshot();
        } );
    } );
});

