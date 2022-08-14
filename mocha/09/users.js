'use strict';

const { expect, assert } = require( 'chai' );
const chai = require( "chai" );

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

require( 'dotenv' ).config();

const { faker } = require( '@faker-js/faker' );

const TOKEN = process.env.TOKEN;

describe( 'Users', function()
{
    describe( 'Users list', function()
    {
        it( 'Має повернути список користувачів', async () =>
        {
            const response = await chai.request( 'http://api.blog.local' )
                .get( '/users' )
                .set( 'Accept',  'application/json' )
                .set( 'Content-Type',  'application/json' )
                .set( 'X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM' )
            expect( response ).to.be.json;

        } );
    } );

    describe( 'Users add', function()
    {
        it( 'Має додати користувача', async () =>
        {
            let login = faker.word.noun();
            let email = login + "@gmail.com";
            let password = login + login;
            let lastname = faker.name.lastName();
            let firstname = faker.name.firstName();

            const response = await chai.request( 'api.blog.local' )
                .post( '/users' )
                .set( 'Accept',  'application/json' )
                .set( 'Content-Type',  'application/json' )
                .set( 'X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM' )
                .send(
                    {
                        "login"    : login,
                        "password" : password,
                        "email"    : email,
                        "lastname" : lastname,
                        "firstname": firstname,
                    } );

            expect( response ).to.be.json;
        } );
    } );
} );
