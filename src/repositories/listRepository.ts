import { DocumentClient } from "aws-sdk/clients/dynamodb"
import Card from "src/models/card-interface";
import ListDB from 'src/models/list-db';


export default class ListRepository {

  private ListTable: string = 'ListTable';
  private CardTable: string = 'CardTable';

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

  async getCardsByListId(listId: string) {
    const queryParam = {
      TableName: this.CardTable,
      IndexName: 'ListIdIndex',
      KeyConditionExpression: 'listId = :listIdValue',
      ExpressionAttributeValues: {
        ':listIdValue': listId,
      },
      ProjectionExpression: 'cardId',
    };
    return await this.docClient.query(queryParam).promise();
  }

  async updateListById(list: ListDB) {
    const updateParam = {
      TableName: this.ListTable,
      Key: { listId: list.listId },
      UpdateExpression: "set #title = :title",
      ExpressionAttributeNames: {
        "#title": "title",
      },
      ExpressionAttributeValues: {
        ":title": list.title,
      },
      ReturnValues: "ALL_NEW",
    }
    return await this.docClient.update(updateParam).promise();
  }


  async updateCardById(card: Card) {
    const updateParam = {
      TableName: this.CardTable,
      Key: { cardId: card.cardId },
      UpdateExpression: "set #title = :title, #text = :text, #position = :position",
      ExpressionAttributeNames: {
        "#title": "title",
        "#text": "text",
        "#position": "position",
      },
      ExpressionAttributeValues: {
        ":title": card.title,
        ":text": card.text,
        ":position": card.position
      },
      ReturnValues: "ALL_NEW",
    }
    return await this.docClient.update(updateParam).promise();
  }

  async getCardsByPosition(deletedCard: Card): Promise<Card[]> {
    const queryParam = {
      TableName: this.CardTable,
      IndexName: 'ListIdIndex',
      KeyConditionExpression: 'listId = :listIdValue',
      FilterExpression: '#positionAttr > :value',
      ExpressionAttributeNames: {
        '#positionAttr': 'position',
      },
      ExpressionAttributeValues: {
        ':listIdValue': deletedCard.listId,
        ':value': deletedCard.position,
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


    /*async updateCardPosition(deletedCard: CardDB) {
    const updateParam = {
      TableName: this.CardTable,
      Key: { cardId: deletedCard.cardId },
      UpdateExpression: 'SET #pos = #pos - :decrementValue',
      ConditionExpression: 'listId = :listIdValue AND #pos > :positionValue',
      ExpressionAttributeNames: {
        '#pos': 'position',
      },
      ExpressionAttributeValues: {
        ':decrementValue': 1,
        ':listIdValue': deletedCard.listId,
        ':positionValue': deletedCard.position,
      },
      ReturnValues: "ALL_NEW",
    }
    try{
    return await this.docClient.update(updateParam).promise();
    } catch (err) {
      throw new Error(`Failed to update card: ${err.message}`);
    }
  }*/

}
