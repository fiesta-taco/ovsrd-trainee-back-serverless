
import dynamoDBClient from "src/models/dynamodb-connection";
import ListRepository from "src/repositories/listRepository";

const listRepository = new ListRepository(dynamoDBClient());

export default listRepository;








