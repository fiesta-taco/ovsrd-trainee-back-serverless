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
        const sortCards = cards.sort((a: Card, b: Card) => a.position - b.position);
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
        const updatingLists = await listRepository.getListsByPosition(deletedList.position);
        await this.decreaseListsPosition(updatingLists);
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
        await this.decreaseCardsPosition(updatingCard);

    }
    async deleteListByIdAndUpdatePosition(listId: string) {
        const deletedList = await listRepository.getListById(listId);
        await listRepository.deleteListById(listId);
        const updatingLists = await listRepository.getListsByPosition(deletedList.position);
        await this.decreaseListsPosition(updatingLists);
    }

    async dragCard(movedCrad: Card) {
        await this.deleteCardByIdAndUpdatePosition(movedCrad.cardId);
        const futureIndexCardInArray = movedCrad.position - 1;
        const updatingCard = await listRepository.getCardsByPosition(movedCrad.listId, futureIndexCardInArray);
        await this.increaseCardsPosition(updatingCard);
        return await listRepository.createCard(movedCrad)
    }

    async dragList(movedList: ListDB) {
        await this.deleteListByIdAndUpdatePosition(movedList.listId);
        const futureIndexListInArray = movedList.position - 1;
        const updatingLists = await listRepository.getListsByPosition(futureIndexListInArray);
        await this.increaseListsPosition(updatingLists);
        return await listRepository.createList(movedList);



    }

    addListId(createList: CreateList) {
        const id = v4();
        const newList: ListDB = {
            listId: id,
            title: createList.title,
            position: createList.position,
        }
        return newList;
    }

    addCardId(cardData: CreateCard) {
        const id = v4();
        const newCard = { ...cardData, cardId: id };
        return newCard;
    }

    async increaseCardsPosition(updatingCard: Card[]) {
        for (const card of updatingCard) {
            card.position = card.position + 1;
            await listRepository.updateCardById(card);
        }
    }
    async decreaseCardsPosition(updatingCard: Card[]) {
        for (const card of updatingCard) {
            card.position = card.position - 1;
            await listRepository.updateCardById(card);
        }
    }
    async increaseListsPosition(updatingLists: ListDB[]) {
        for (const list of updatingLists) {
            list.position = list.position + 1;
            await listRepository.updateListById(list);
        }
    }
    async decreaseListsPosition(updatingLists: ListDB[]) {
        for (const list of updatingLists) {
            list.position = list.position - 1;
            await listRepository.updateListById(list);
        }
    }
}