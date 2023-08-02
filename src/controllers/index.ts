
import { handlerPath } from "@libs/handler-resolver";

export const getListsAndCards = {
    handler: `${handlerPath(__dirname)}/listController.getListsAndCards`,
    events: [
        {
            http: {
                method: 'GET',
                path: 'lists',
            },
        },
    ]
};
export const createList = {
    handler: `${handlerPath(__dirname)}/listController.createList`,
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
    events: [
        {
            http: {
                method: 'PUT',
                path: 'card',
            },
        },
    ],
};
