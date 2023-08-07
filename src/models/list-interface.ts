import Card from "./card-interface";

export default interface List {
    listId: string;
    title: string;
    cards: Card[];
}

