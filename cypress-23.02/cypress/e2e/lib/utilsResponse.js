const utilsResponse = {};

utilsResponse.checkHttpStatus = ( response ) =>
{
    expect( response ).to.have.property( 'statusCode' );
    expect( response.statusCode ).to.eq( 200 );
    expect( response ).to.have.property( 'statusMessage' );
    expect( response.statusMessage ).to.eq( 'OK' );
};

utilsResponse.checkJSON = ( response ) =>
{
    utilsResponse.checkHttpStatus( response );

    expect( response.headers ).to.have.property( 'content-type' );
    expect( response.headers[ 'content-type' ] ).to.eql( 'application/json' );
};

utilsResponse.checkHTML = ( response ) =>
{
    utilsResponse.checkHttpStatus( response );

    expect( response.headers ).to.have.property( 'content-type' );
    expect( response.headers[ 'content-type' ] ).to.eql( 'text/html; charset=UTF-8' );
};

export default {
    utilsResponse
};