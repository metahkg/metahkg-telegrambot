import { MongoClient } from "mongodb";
import { mongouri } from "../../common";
export async function getcat(id?: number) {
    const client = new MongoClient(mongouri);
    await client.connect();
    const category = client.db("metahkg-threads").collection("category");
    const r = await category.find(id ? {id: id} : {}).sort({id: 1}).toArray();
    return JSON.stringify(r, null, 2);
}