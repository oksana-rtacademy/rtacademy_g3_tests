const utilsFunc = {};

const _ = require( 'lodash' );

utilsFunc.getElemInArray = function( arr )
{
    const arr_length = arr.length - 1;

    return arr[ _.random( 0, arr_length ) ];
};;

export default {
    utilsFunc
};