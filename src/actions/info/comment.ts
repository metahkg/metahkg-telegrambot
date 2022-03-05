import beautify from "json-beautify";
import { MongoClient } from "mongodb";
import { mongouri } from "../../common";
export async function getcomment(tid: number, cid: number) {
  const client = new MongoClient(mongouri);
  await client.connect();
  const conversation = client.db("metahkg-threads").collection("conversation");
  const r = (await conversation.findOne(
    { id: tid },
    {
      projection: {
        conversation: {
          $filter: {
            input: "$conversation",
            cond: {
              $and: [
                { $gte: ["$$this.id", cid] },
                { $lte: ["$$this.id", cid] },
              ],
            },
          },
        },
      },
    }
  ))?.conversation?.[0];
  return beautify(r, null, 2);
}
