import listService from '../src/services'
import CreateList from '../src/models/interfaces/CreateList'
import ListDB from '../src/models/interfaces/ListDB'

const testData:CreateList = {
    position: 1,
    title: "test",
};

	
test('test service addListId', async() => {
    const result = await listService.addListId(testData);
    expect(result).toEqual(expect.objectContaining({} as ListDB))
   
  });