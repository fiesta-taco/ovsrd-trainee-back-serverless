
import dynamoDBClient from "../models/dynamodb-connection";
import ListRepository from "../repositories/listRepository";

const listRepository = new ListRepository(dynamoDBClient());

export default listRepository;








