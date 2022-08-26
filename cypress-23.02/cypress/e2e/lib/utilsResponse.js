const utilsResponse = {};

utilsResponse.checkHttpStatus = ( response, statusCode = 200 ) =>
{
    expect( response ).to.have.property( 'statusCode' );
    expect( response.statusCode ).to.eq( statusCode );
};

utilsResponse.checkJSON = ( response ) =>
{
    expect( response.headers ).to.have.property( 'content-type' );
    expect( response.headers[ 'content-type' ] ).to.include( 'application/json' );
};

utilsResponse.checkHTML = ( response ) =>
{
    expect( response.headers ).to.have.property( 'content-type' );
    expect( response.headers[ 'content-type' ] ).to.include( 'text/html' );
};

utilsResponse.checkTimeoutContentTypeStatus = ( response, pageLoadStart, timeout, contentType, statusCode ) =>
{
    const pageLoadEnd = new Date().getTime();

    cy.log( 'Page Load Time: ' + ( pageLoadEnd - pageLoadStart ) + 'ms' );

    // перевірка на час завантаження сторінки
    expect( ( () => timeout > pageLoadEnd - pageLoadStart )() ).to.be.true;

    utilsResponse.checkHttpStatus( response, statusCode );
    utilsResponse[contentType]( response );
};

export default {
    utilsResponse
};