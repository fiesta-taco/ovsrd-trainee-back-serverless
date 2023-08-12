import Card from "./Card";

export default interface List {
    listId: string;
    title: string;
    position:number;
    cards: Card[];
}

