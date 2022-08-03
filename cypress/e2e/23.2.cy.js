describe( 'Blog', () =>
{
    it( 'Open homepage, check for 3 records', () =>
    {
        cy.visit( 'http://localhost:8888/' );

        cy.get( 'main.main-posts > div.posts article' ).should( ( article ) => expect( article ).to.have.length( 3 ) );
    } );

    it( 'Open homepage, load more, check for 3 loaded, check for 6 records', () =>
    {
        cy.visit( 'http://localhost:8888/' );

        cy.intercept( 'GET', '**/posts_ajax.php?page=2' ).as( 'postsLoadMore' );

        cy.get( '#load-more' ).click();

        cy.wait( '@postsLoadMore' ).should( ( { request, response } ) =>
        {
            expect( response.body ).to.have.length( 3 );
            expect( response ).to.have.property( 'statusCode' ).to.eql( 200 );
            expect( response.headers ).to.have.property( 'content-type' ).to.eql( 'application/json' );
        } );

        cy.get( 'main.main-posts > div.posts article' ).should( ( article ) => expect( article ).to.have.length( 6 ) );
    } );

    it( 'Open homepage, load more, check open post', () =>
    {
        cy.visit( 'http://localhost:8888/' );

        cy.get( '#load-more' ).click();

        cy.intercept( 'GET', '**/single.php?id=4' ).as( 'onePost' );

        cy.get( 'main.main-posts > div.posts article:nth-child(5)' ).click();

        cy.wait( '@onePost' ).should( ( { request, response } ) =>
        {
            expect( response ).to.have.property( 'statusCode' ).to.eql( 200 );
            expect( response.headers ).to.have.property( 'content-type' ).to.eql( 'text/html; charset=UTF-8' );
        } );
    } );
} );