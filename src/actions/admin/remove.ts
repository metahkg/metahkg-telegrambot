import { MongoClient } from "mongodb";
import { mongouri } from "../../common";
export async function rmthread(id: number): Promise<boolean> {
  const client = new MongoClient(mongouri);
  await client.connect();
  const metahkgthreads = client.db("metahkg-threads");
  const conversation = metahkgthreads.collection("conversation");
  const summary = metahkgthreads.collection("summary");
  const hottest = metahkgthreads.collection("hottest");
  const users = metahkgthreads.collection("users");
  for (const i of [conversation, summary, hottest, users]) {
    await i.deleteMany({ id: id });
  }
  return true;
}
export async function rmcomment(tid: number, cid: number): Promise<boolean> {
  if (cid === 1) return false;
  const client = new MongoClient(mongouri);
  await client.connect();
  const metahkgthreads = client.db("metahkg-threads");
  const conversation = metahkgthreads.collection("conversation");
  const users = metahkgthreads.collection("users");
  const userid = (await conversation.findOne({ id: tid })).conversation?.[
    cid - 1
  ].user;
  if (!userid) return false;
  await conversation.updateOne(
    {
      id: tid,
    },
    { $set: { [`conversation.${cid - 1}`]: { id: cid, removed: true } } }
  );
  const c = await conversation.findOne(
    { id: tid },
    {
      projection: {
        conversation: {
          $filter: {
            input: "$conversation",
            cond: {
              $and: [
                { $gte: ["$$this.user", userid] },
                { $lte: ["$$this.user", userid] },
              ],
            },
          },
        },
      },
    }
  );
  console.log(c);
  if (!c?.conversation?.length)
    await users.updateOne({ id: tid }, { $unset: { [userid]: 1 } });
  return true;
}
