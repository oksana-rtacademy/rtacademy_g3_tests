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
        it('Має додати нового користувача', async () =>
        {
            let login = faker.word.noun();
            let email = login + "@gmail.com";
            let password = login + login;
            let lastname = faker.name.lastName();
            let firstname = faker.name.firstName();
            let response = await chai.request("http://api.blog.local")
                .post("/users")
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM')
                .send(
                    {
                        "login": login,
                        "password": password,
                        "email": email,
                        "lastname": lastname,
                        "firstname": firstname
                    });

            expect(response).to.be.json;
            expect(response).to.have.status(201);

            expect(response.body).to.have.property('id').to.be.a('number');
            expect(response.body).to.have.property('login').to.be.a('string');
            expect(response.body).to.have.property('email').to.be.a('string');
            expect(response.body).to.have.property('lastname').to.be.a('string');
            expect(response.body).to.have.property('firstname').to.be.a('string')

        });

        it('Не має додати нового користувача прои відправці порожнього body', async () =>
        {
            let response = await chai.request("http://api.blog.local")
                .post("/users")
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM')
                .send();


            expect(response).to.have.status(400);
            // console.log(response.body);

            expect( response.body ).to.have.property('type').that.a('string');
            expect( response.body ).to.have.property('title').that.a('string')
            expect( response.body ).to.have.property('detail').that.a('string');
            expect( response.body ).to.have.property('trace').that.a('array');

            expect( response.body.detail ).to.equal('Syntax error');

            expect( response.body.title ).to.equal('An error occurred');

        });

        it('Не має додати нового користувача при відправці порожнього JSON', async () =>
        {
            let response = await chai.request("http://api.blog.local")
                .post("/users")
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM')
                .send({});

            expect(response).to.have.status(422);

            expect( response.body ).to.have.property('type').that.a('string');
            expect( response.body ).to.have.property('title').that.a('string');
            expect( response.body ).to.have.property('detail').that.a('string');
            expect( response.body ).to.have.property('violations').that.a('array');

            expect( response.body.detail ).to.equal('login: This value should not be blank.\n' +
                'password: This value should not be blank.\n' +
                'email: This value should not be blank.\n' +
                'lastname: This value should not be blank.\n' +
                'firstname: This value should not be blank.');

            expect( response.body.title ).to.equal('An error occurred');
        });

        it('Не має додати нового користувача, якщо відсутній логін', async () =>
        {
            let login = faker.word.noun();
            let email = login + "@gmail.com";
            let password = login + login;
            let lastname = faker.name.lastName();
            let firstname = faker.name.firstName();
            let response = await chai.request("http://api.blog.local")
                .post("/users")
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM')
                .send(
                    {
                        "password": password,
                        "email": email,
                        "lastname": lastname,
                        "firstname": firstname
                    });

            expect(response).to.have.status(422);

            expect( response.body ).to.have.property('type').that.a('string');
            expect( response.body ).to.have.property('title').that.a('string');
            expect( response.body ).to.have.property('detail').that.a('string');
            expect( response.body ).to.have.property('violations').that.a('array');

            expect( response.body.detail ).to.equal('login: This value should not be blank.');
            expect( response.body.title ).to.equal('An error occurred');

            expect( response.body.violations[0]).to.have.property('propertyPath').to.equal('login');
            expect( response.body.violations[0]).to.have.property('message').to.equal('This value should not be blank.');
            expect( response.body.violations[0]).to.have.property('code').to.equal('c1051bb4-d103-4f74-8988-acbcafc7fdc3');

        });

        it('Не має додати нового користувача, якщо логін має інший тип', async () =>
        {
            let login = faker.word.noun();
            let email = login + "@gmail.com";
            let password = login + login;
            let lastname = faker.name.lastName();
            let firstname = faker.name.firstName();
            let response = await chai.request("http://api.blog.local")
                .post("/users")
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM')
                .send(
                    {
                        "login": 5,
                        "password": password,
                        "email": email,
                        "lastname": lastname,
                        "firstname": firstname
                    });

            expect(response).to.have.status(400);

            expect( response.body ).to.have.property('type').that.a('string');
            expect( response.body ).to.have.property('title').that.a('string');
            expect( response.body ).to.have.property('detail').that.a('string');
            expect( response.body ).to.have.property('trace').that.a('array');

            expect( response.body.detail ).to.equal('The type of the "login" attribute must be "string", "integer" given.');
            expect( response.body.title ).to.equal('An error occurred');

        });

        it('Не має додати нового користувача, якщо логін містить порожній рядок', async () =>
        {
            let login = faker.word.noun();
            let email = login + "@gmail.com";
            let password = login + login;
            let lastname = faker.name.lastName();
            let firstname = faker.name.firstName();
            let response = await chai.request("http://api.blog.local")
                .post("/users")
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('X-TOKEN', '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM')
                .send(
                    {
                        "login": "",
                        "password": password,
                        "email": email,
                        "lastname": lastname,
                        "firstname": firstname
                    });

            expect(response).to.have.status(422);

            expect( response.body ).to.have.property('type').that.a('string');
            expect( response.body ).to.have.property('title').that.a('string');
            expect( response.body ).to.have.property('detail').that.a('string');

            expect( response.body.detail ).to.equal('login: This value should not be blank.');

            expect( response.body.title ).to.equal('An error occurred');

            expect( response.body.violations[0]).to.have.property('propertyPath').to.equal('login');
            expect( response.body.violations[0]).to.have.property('message').to.equal('This value should not be blank.');
            expect( response.body.violations[0]).to.have.property('code').to.equal('c1051bb4-d103-4f74-8988-acbcafc7fdc3');


        });
    } );
} );
