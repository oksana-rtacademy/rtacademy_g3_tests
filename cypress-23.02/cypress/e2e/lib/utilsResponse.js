const utilsResponse = {};

utilsResponse.checkHttpStatus = ( response, statusCode = 200 ) =>
{
    expect( response ).to.have.property( 'statusCode' );
    expect( response.statusCode ).to.eq( statusCode );
};

utilsResponse.checkContentType = ( response, contentType ) =>
{
    expect( response.headers ).to.have.property( 'content-type' );

    if( contentType === 'checkJSON' )
    {
        expect( response.headers[ 'content-type' ] ).to.include( 'application/json' );
    }
    else if( contentType === 'checkHTML' )
    {
        expect( response.headers[ 'content-type' ] ).to.include( 'text/html' );
    }
};

utilsResponse.checkTimeoutContentTypeStatus = ( response, pageLoadStart, timeout, contentType, statusCode ) =>
{
    const pageLoadEnd = new Date().getTime();

    cy.log( 'Page Load Time: ' + ( pageLoadEnd - pageLoadStart ) + 'ms' );

    // перевірка на час завантаження сторінки
    expect( ( () => timeout > pageLoadEnd - pageLoadStart )() ).to.be.true;

    utilsResponse.checkHttpStatus( response, statusCode );
    utilsResponse.checkContentType( response, contentType );
};

export default {
    utilsResponse
};