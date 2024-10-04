// noinspection JSUnusedGlobalSymbols,ES6UnusedImports

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth"

declare module "next-auth" {

    interface Profile {
        id: string,
        cid: string,
        personal: {
            name_first: string,
            name_last: string,
            name_full: string,
            email: string,
        },
        vatsim: {
            rating: {
                id: number,
                long: string,
                short: string,
            },
            pilotrating: {
                id: number,
                long: string,
                short: string,
            },
            division: {
                id: string,
                name: string,
            },
            region: {
                id: string,
                name: string,
            },
            subdivision: {
                id: string,
                name: string,
            },
        }
    }

    interface User {
        id: string,
        cid: string,
        firstName: string,
        lastName: string,
        fullName: string,
        email: string,
        artcc: string,
        rating: number,
        division: string,
    }

    interface AdapterUser {
        id: string,
        cid: string,
        firstName: string,
        lastName: string,
        fullName: string,
        email: string,
        artcc: string,
        rating: number,
        division: string,
    }

    interface Session {
        user: {
            id: string,
            cid: string,
            firstName: string,
            lastName: string,
            fullName: string,
            email: string,
            artcc: string,
            rating: number,
            division: string,
        }
    }

}