import List from "src/models/interfaces/List";
import listRepository from "../repositories";
import ListDB from "src/models/interfaces/ListDB";
import Card from "src/models/interfaces/Card";
import { v4 } from "uuid";
import CreateList from "src/models/interfaces/CreateList";
import CreateCard from "src/models/interfaces/CreateCard";



export default class ListService {


    async getListsAndCards(): Promise<List[]> {
        const lists = await listRepository.getLists();
        const cards = await listRepository.getCards();
        const cardByListId = cards.reduce((acc, card) => {
            const listId = card.listId;
            if (!acc[listId]) {
                acc[listId] = [];
            }
            acc[listId].push(card);
            return acc;
        }, []);

        const resultLists: List[] = lists.map(list => ({
            listId: list.listId,
            title: list.title,
            position: list.position,
            cards: (cardByListId[list.listId] || []).sort((a: Card, b: Card) => a.position - b.position),
        }))
            .sort((a, b) => a.position - b.position);
        return resultLists;
    }

    async getCardsByListId(listId: string): Promise<Card[]> {
        const cards = await listRepository.getCardsByListId(listId);
        const sortCards = cards.sort((a:Card, b:Card) => a.position - b.position);
        return sortCards;
    }

    async createList(createList: CreateList) {
        const newList = this.addListId(createList);
        return await listRepository.createList(newList);
    }

    async createCard(cardData: CreateCard) {
        const newCard = this.addCardId(cardData);
        return await listRepository.createCard(newCard);
    }

    async updateList(list: ListDB) {
        await listRepository.updateListById(list);
        return list;
    }

    async deleteList(listId: string) {
        const deletedList = await listRepository.getListById(listId);
        await this.deleteCardsByListId(listId);
        await listRepository.deleteListById(listId);
        const updatingLists = await listRepository.getListsByPosition(deletedList);
        for (const list of updatingLists) {
            list.position = list.position - 1;
            await listRepository.updateListById(list);
        }
    }

    async updateCard(card: Card): Promise<Card> {
        return await listRepository.updateCardById(card)
    }

    async deleteCardsByListId(listId: string) {
        const cards = await listRepository.getCardsIdByListId(listId);
        const deleteRequests = cards.map((card: Card) => ({
            DeleteRequest: {
                Key: { cardId: card.cardId },
            },
        }));
        while (deleteRequests.length > 0) {
            const batchDeleteRequests = deleteRequests.splice(0, 25);
            await listRepository.groupDeleteCards(batchDeleteRequests);
        }
    }

    async deleteCardByIdAndUpdatePosition(cardId: string) {
        const deletedCard = await listRepository.getCardById(cardId)
        await listRepository.deleteCardById(cardId);
        const updatingCard = await listRepository.getCardsByPosition(deletedCard.listId, deletedCard.position);
        for (const card of updatingCard) {
            card.position = card.position - 1;
            await listRepository.updateCardById(card);
        }
    }
    async dragCard(movedCrad: Card) {
        await this.deleteCardByIdAndUpdatePosition(movedCrad.cardId);
        await this.createPositionByDraggedCard(movedCrad.listId, movedCrad.position-1);
        return await listRepository.createCard(movedCrad)
    }
/**
 * update all cards position(increase by 1) witch >= future index array
 * @param listId search cards
 * @param futureIndexArray cards in list by condition
 */
    async createPositionByDraggedCard(listId: string, futureIndexArray: number) {
        const updatingCard = await listRepository.getCardsByPosition(listId, futureIndexArray);
        for (const card of updatingCard) {
            card.position = card.position + 1;
            await listRepository.updateCardById(card);
        }
    }

    addListId(createList:CreateList){
        const id = v4();
        const newList: ListDB = {
            listId: id,
            title: createList.title,
            position: createList.position,
        }
        return newList;
    }

    addCardId(cardData:CreateCard){
        const id = v4();
        const newCard = { ...cardData, cardId: id };
        return newCard;
    }

}