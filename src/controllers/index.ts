
import { handlerPath } from "@libs/handler-resolver";

export const getListsAndCards = {
    handler: `${handlerPath(__dirname)}/listController.getListsAndCards`,
    timeout:10,
    events: [
        {
            http: {
                method: 'GET',
                path: 'lists',
            },
        },
    ]
};
export const getCardsByListId = {
    handler: `${handlerPath(__dirname)}/listController.getCardsByListId`,
    timeout:10,
    events: [
        {
            http: {
                method: 'GET',
                path: 'cards/{id}',
            },
        },
    ]
};
export const createList = {
    handler: `${handlerPath(__dirname)}/listController.createList`,
    timeout:10,
    events: [
        {
            http: {
                method: 'POST',
                path: 'list',

            },
        },
    ],
};

export const createCard = {
    handler: `${handlerPath(__dirname)}/listController.createCard`,
    timeout:10,
    events: [
        {
            http: {
                method: 'POST',
                path: 'card',
            },
        },
    ],
};

export const deleteList = {
    handler: `${handlerPath(__dirname)}/listController.deleteList`,
    timeout:10,
    events: [
        {
            http: {
                method: 'DELETE',
                path: 'list/{id}',
                cors: true,
            },
        },
    ],
};

export const deleteCard = {
    handler: `${handlerPath(__dirname)}/listController.deleteCard`,
    timeout:10,
    events: [
        {
            http: {
                method: 'DELETE',
                path: 'card/{id}',
                cors: true,
            },
        },
    ],
};



export const updateList = {
    handler: `${handlerPath(__dirname)}/listController.updateList`,
    timeout:10,
    events: [
        {
            http: {
                method: 'PUT',
                path: 'list',
                cors: true,
            },
        },
    ],
};

export const updateCard = {
    handler: `${handlerPath(__dirname)}/listController.updateCard`,
    timeout:10,
    events: [
        {
            http: {
                method: 'PUT',
                path: 'card',
                cors: true,
            },
        },
    ],
};