
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import cors from "@middy/http-cors"
import listService from "src/services";
import List from "src/models/interfaces/List";
import Card from "src/models/interfaces/Card";





export const getListsAndCards = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const lists: List[] = await listService.getListsAndCards();
    return formatJSONResponse({
        lists
    })
}).use(cors());

export const getCardsByListId = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const listId = event.pathParameters.id;
    const cards: Card[] = await listService.getCardsByListId(listId);
    return formatJSONResponse({
        cards
    })
}).use(cors());


export const createList = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const newList = await listService.createList(event.body);
        return formatJSONResponse({
            list:newList
        })
    } catch (err) {
        return formatJSONResponse({
            status: 500, message: err
        });
    }
}).use(cors());

export const createCard = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const card = await listService.createCard(event.body)
        return formatJSONResponse({
            card
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(cors());

export const updateList = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const newList = await listService.updateList(event.body)
        return formatJSONResponse({
            list:newList
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(cors());

export const deleteList = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const listId = event.pathParameters.id;
    try {
        await listService.deleteList(listId)
        return formatJSONResponse({ ok: true });
    } catch (e) {
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(cors());

export const updateCard = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const card = await listService.updateCard(event.body)
        
        return formatJSONResponse({
            card
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(cors());



export const deleteCard = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const cardId = event.pathParameters.id;
    try {
        await listService.deleteCardByIdAndUpdatePosition(cardId)
        return formatJSONResponse({ ok: true });
    } catch (e) {
        return formatJSONResponse({
            status: 500, message: e
        });
    }
}).use(cors());
