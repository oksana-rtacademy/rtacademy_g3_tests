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
        it( 'Перегляд списку користувачів', async () =>
        {
            const res = await chai.request( 'http://api.blog.local:80' )
                .get( '/users' )
                .set( 'Accept',  'application/json' )
                .set( 'Content-Type',  'application/json' )
                .set( 'X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM' )
            expect( res ).to.be.json;

            console.log(res.body);
        } );
    } );

    describe( 'Users add', function()
    {
        it( 'Додавання користувача', async () =>
        {
            let login = faker.word.noun();
            let email = login + "@gmail.com";
            let password = login + login;

            const res = await chai.request( 'api.blog.local' )
                .post( '/users' )
                .set( 'Accept',  'application/json' )
                .set( 'Content-Type',  'application/json' )
                .set( 'X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM' )
                .send(
                {
                    "login"    : login,
                    "password" : password,
                    "email"    : email,
                    "lastname" : faker.name.lastName(),
                    "firstname": faker.name.firstName(),
                } );

            expect( res ).to.be.json;
        } );
    } );
} );
