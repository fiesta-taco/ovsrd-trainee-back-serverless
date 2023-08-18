
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import listService from "src/services";
import List from "src/models/interfaces/List";
import Card from "src/models/interfaces/Card";
import httpCors from "@middy/http-cors";





export const getListsAndCards = middyfy(async (): Promise<APIGatewayProxyResult> => {
    try{
    const lists: List[] = await listService.getListsAndCards();
    return formatJSONResponse({
        lists
    });
} catch (err) {
    if (err.code === "ResourceNotFoundException") {
        console.error("The requested table does not exist in the database.===----------!!!!");
    }
    return formatJSONResponse({
        status: 500, message: err
    });
}
}).use(httpCors({
    origin: '*',
}));

export const getCardsByListId = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
    const listId = event.pathParameters.id;
    const cards: Card[] = await listService.getCardsByListId(listId);
    return formatJSONResponse({
        cards
    });
} catch (err) {
    if (err.code === "ResourceNotFoundException") {
        console.error("The requested table does not exist in the database.===----------!!!!");
    }
    return formatJSONResponse({
        status: 500, message: err
    });
}
}).use(httpCors({
    origin: '*',
}));


export const createList = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const newList = await listService.createList(event.body);
        return formatJSONResponse({
            list: newList
        })
    } catch (err) {
        if (err.code === "ResourceNotFoundException") {
            console.error("The requested table does not exist in the database.===----------!!!!");
        }
        return formatJSONResponse({
            status: 500, message: err
        });
    }
}).use(httpCors({
    origin: '*',
}));

export const createCard = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const card = await listService.createCard(event.body)
        return formatJSONResponse({
            card
        });
    } catch (e) {
        if (e.code === "ResourceNotFoundException") {
            console.error("The requested table does not exist in the database.===----------!!!!");
        }
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(httpCors({
    origin: '*',
}));

export const updateList = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const newList = await listService.updateList(event.body)
        return formatJSONResponse({
            list: newList
        });
    } catch (e) {
        if (e.code === "ResourceNotFoundException") {
            console.error("The requested table does not exist in the database.===----------!!!!");
        }
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(httpCors({
    origin: '*',
}));

export const deleteList = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const listId = event.pathParameters.id;
    try {
        await listService.deleteList(listId)
        return formatJSONResponse({ ok: true });
    } catch (e) {
        if (e.code === "ResourceNotFoundException") {
            console.error("The requested table does not exist in the database.===----------!!!!");
        }
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(httpCors({
    origin: '*',
}));

export const updateCard = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const card = await listService.updateCard(event.body)

        return formatJSONResponse({
            card
        });
    } catch (e) {
        if (e.code === "ResourceNotFoundException") {
            console.error("The requested table does not exist in the database.===----------!!!!");
        }
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(httpCors({
    origin: '*',
}));



export const deleteCard = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const cardId = event.pathParameters.id;
    try {
        await listService.deleteCardByIdAndUpdatePosition(cardId)
        return formatJSONResponse({ ok: true });
    } catch (e) {
        if (e.code === "ResourceNotFoundException") {
            console.error("The requested table does not exist in the database.===----------!!!!");
        }
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(httpCors({
    origin: '*',
}));

export const dragCard = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const card = await listService.dragCard(event.body)
        return formatJSONResponse({
            card
        });
    } catch (e) {
        if (e.code === "ResourceNotFoundException") {
            console.error("The requested table does not exist in the database.===----------!!!!");
        }
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(httpCors({
    origin: '*',
}));
