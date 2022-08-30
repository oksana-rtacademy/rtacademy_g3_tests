import { utilsResponse } from "./lib/utilsResponse";
import { utilsUser }     from "./lib/utilsUser";
import { utilsFunc }     from "./lib/utilsFunc";
import { faker }         from "@faker-js/faker";

const dayjs = require('dayjs');
const request = require('request');

describe( 'Posts', () =>
{
    it( 'Список постів ', () =>
    {
        cy.request(
        {
            method : 'GET',
            url    : 'http://api.blog.local/posts',
            headers:
            {
                'Accept'      : 'application/json',
                'X-TOKEN'     : '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM',
                'Content-Type': 'application/json'
            }
        } )
        .then(
            ( response ) =>
            {
                expect( response.body ).to.be.an('array');
                expect( response.body[0] ).to.have.property('id');
            }
        )
    } );

    it( 'Додати пост через запит', () =>
    {
        const time = new Date().getTime(),
            name = faker.word.noun(),
            content = faker.lorem.sentences( 4 ),
            publishDate = dayjs().subtract( 1, 'd' ).format( 'YYYY-MM-DDTHH:mm' );

        cy.request(
            {
                method : 'POST',
                url    : 'http://api.blog.local/posts',
                headers:
                    {
                        'Accept'      : 'application/json',
                        'X-TOKEN'     : '1SEkpnyDplN0DVqvRkgcRur6HKmg7TGahW3MF3RkirOIuuX3tzFlpU7f5IbUhFPFWtH21KQG3XzRMP9CnVbyPWiCWiJ4HYaDRhL3y955h7XByl7ZaNXIdmiuYAaBZcjM',
                        'Content-Type': 'application/json'
                    },
                body:
                    {
                        title: name,
                        alias: name,
                        content: content,
                        author: "users/63",
                        category: "categories/2",
                        status: "published",
                        publishDate: publishDate
                    }
            } )
            .then(
                ( response ) =>
                {
                    // response.body is automatically serialized into JSON
                    expect( response.body ).to.have.property( 'title', name ) // true
                }
            )

    } );

} );


