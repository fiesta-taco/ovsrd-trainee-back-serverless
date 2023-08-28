import listService from '../src/services'
import CreateCard from '../src/models/interfaces/CreateCard'
import Card from '../src/models/interfaces/Card'
const testData:CreateCard = {
    listId: "test",
    position: 1,
    title: "test",
    cardText: "test",
    s3Key:"test",
}
	
test('test service addCardId obj', async() => {
    const result = await listService.addCardId(testData);
    expect(result).toEqual(expect.objectContaining({} as Card))
  });