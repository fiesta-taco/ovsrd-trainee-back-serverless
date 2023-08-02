import List from "src/models/list-interface";
import listRepository from "../repositories";
import ListDB from "src/models/list-db";
import Card from "src/models/card-interface";


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
        }, {});

        const resultLists: List[] = lists.map(list => ({
            listId: list.listId,
            title: list.title,
            cards: cardByListId[list.listId] || [],
        }));
        return resultLists;
    }

    async createList(date: unknown) {
        const list = date as ListDB;
        return await listRepository.createList(list);
    }

    async createCard(data: unknown) {
        const card = data as Card;
        return await listRepository.createCard(card);
    }

    async updateList(data: unknown) {
        const list = data as ListDB;
        return await listRepository.updateListById(list)
    }

    async updateCard(data: unknown) {
        const card = data as Card;
        return await listRepository.updateCardById(card)
    }

    async deleteList(listId: string) {
        await this.deleteCardsByListId(listId);
        await listRepository.deleteListById(listId);
    }

    async deleteCardsByListId(listId: string) {
        const cards = await listRepository.getCardsByListId(listId);
        const deleteRequests = cards.Items.map((card: Card) => ({
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
        const updatingCard = await listRepository.getCardsByPosition(deletedCard);
        for (const card of updatingCard) {
            card.position = card.position - 1;
            await listRepository.updateCardById(card);
        }
    }

}