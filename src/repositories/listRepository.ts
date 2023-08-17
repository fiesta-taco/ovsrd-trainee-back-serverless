import { DocumentClient } from "aws-sdk/clients/dynamodb"
import Card from "src/models/interfaces/Card";
import ListDB from 'src/models/interfaces/ListDB';


export default class ListRepository {

  private ListTable: string = 'ListTable';
  private CardTable: string = 'CardTable';
 // private ListTable: string =  process.env.LIST_TABLE;
 // private CardTable: string =  process.env.CARD_TABLE;

  constructor(private docClient: DocumentClient) { }

  async getLists(): Promise<ListDB[]> {
    const getListsParam = {
      TableName: this.ListTable,
    }
    const lists = await this.docClient.scan(getListsParam).promise();
    return lists.Items as ListDB[];
  }

  async getCards(): Promise<Card[]> {
    const getCardsParam = {
      TableName: this.CardTable,
    }
    const lists = await this.docClient.scan(getCardsParam).promise();
    return lists.Items as Card[];
  }

  async getCardById(cardId: string): Promise<Card> {
    const getCard = {
      TableName: this.CardTable,
      Key: { cardId: cardId }
    }
    const card = await this.docClient.get(getCard).promise();
    return card.Item as Card;
  }

  async getListById(listId: string): Promise<ListDB> {
    const getList = {
      TableName: this.ListTable,
      Key: { listId: listId }
    }
    const list = await this.docClient.get(getList).promise();
    return list.Item as ListDB;
  }

  async createList(list: ListDB) {
    const createListParam = {
      TableName: this.ListTable,
      Item: list
    }
    await this.docClient.put(createListParam).promise();
    return list;
  }

  async createCard(card: Card): Promise<Card> {
    const createListParam = {
      TableName: this.CardTable,
      Item: card,
    }
    await this.docClient.put(createListParam).promise();
    return card;
  }

  async deleteCardById(cardId: string): Promise<any> {
    const deleteCardParam = {
      TableName: this.CardTable,
      Key: { cardId: cardId }
    }
    await this.docClient.delete(deleteCardParam).promise();
  }

  async getCardsIdByListId(listId: string):Promise<Card[]> {
    const queryParam = {
      TableName: this.CardTable,
      IndexName: 'ListIdIndex',
      KeyConditionExpression: 'listId = :listIdValue',
      ExpressionAttributeValues: {
        ':listIdValue': listId,
      },
      ProjectionExpression: 'cardId',
    };
    const cards = await this.docClient.query(queryParam).promise();
    return cards.Items as Card[];
  }

  async updateListById(list: ListDB) {
    const updateParam = {
      TableName: this.ListTable,
      Key: { listId: list.listId },
      UpdateExpression: "set #title = :title, #position = :position",
      ExpressionAttributeNames: {
        "#title": "title",
        "#position":"position",
      },
      ExpressionAttributeValues: {
        ":title": list.title,
        ":position":list.position,
      },
      ReturnValues: "ALL_NEW",
    }
     await this.docClient.update(updateParam).promise();
  }


  async updateCardById(card: Card):Promise<Card> {
    const updateParam = {
      TableName: this.CardTable,
      Key: { cardId: card.cardId },
      UpdateExpression: "set #title = :title, #cardText = :cardText, #position = :position, #imageURL = :imageURL",
      ExpressionAttributeNames: {
        "#title": "title",
        "#cardText": "cardText",
        "#position": "position",
        "#imageURL": "imageURL"
      },
      ExpressionAttributeValues: {
        ":title": card.title,
        ":cardText": card.cardText,
        ":position": card.position,
        ":imageURL": card.imageURL,
      },
      ReturnValues: "ALL_NEW",
    }
    const updatedCard = await this.docClient.update(updateParam).promise();
    return updatedCard.Attributes as Card;
  }

  async getCardsByListId(listId: string):Promise<Card[]>{
    const queryParam = {
      TableName: this.CardTable,
      IndexName: 'ListIdIndex',
      KeyConditionExpression: 'listId = :listIdValue',
      ExpressionAttributeValues: {
        ':listIdValue': listId,
      },
    };
    const cards = await this.docClient.query(queryParam).promise();
    return cards.Items as Card[];
  }

  async getListsByPosition(deletedList: ListDB):Promise<ListDB[]>{
    const queryParam = {
      TableName: this.ListTable,
      FilterExpression: '#positionAttr > :value',
      ExpressionAttributeNames: {
        '#positionAttr': 'position',
      },
      ExpressionAttributeValues: {
        ':value': deletedList.position,
      },
    }
    const lists = await this.docClient.scan(queryParam).promise();
    return lists.Items as ListDB[]
  }

  async getCardsByPosition(listId:string, position: number): Promise<Card[]> {
    const queryParam = {
      TableName: this.CardTable,
      IndexName: 'ListIdIndex',
      KeyConditionExpression: 'listId = :listIdValue',
      FilterExpression: '#positionAttr > :value',
      ExpressionAttributeNames: {
        '#positionAttr': 'position',
      },
      ExpressionAttributeValues: {
        ':listIdValue': listId,
        ':value': position,
      },
    }
    const cards = await this.docClient.query(queryParam).promise();
    return cards.Items as Card[]
  }

  async groupDeleteCards(batchDeleteRequests) {
    const batchWriteParams = {
      RequestItems: {
        [this.CardTable]: batchDeleteRequests,
      },
    };
    return await this.docClient.batchWrite(batchWriteParams, (err, data) => {
      if (err) {
        return err;
      } else {
        return data
      }
    }).promise();
  }

  async deleteListById(listId: string) {
    const param = {
      TableName: this.ListTable,
      Key: { listId: listId },
    }
    return await this.docClient.delete(param, (err, data) => {
      if (err) {
        return err;
      } else {
        return data.Attributes
      }
    }).promise();
  }


}
