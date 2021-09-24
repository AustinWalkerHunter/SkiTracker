import { API, graphqlOperation } from 'aws-amplify';
import { deleteCheckIn } from '../src/graphql/mutations'
import GLOBAL from './global';

export async function deleteSelectedCheckIn(item) {
    if (item) {
        try {
            if (GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) {
                await API.graphql(graphqlOperation(deleteCheckIn, { input: { id: item.id } }));
                console.log("CheckIn deleted.")
            }
        } catch (error) {
            console.log("Error deleting from db")
        }
    }
}