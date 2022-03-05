import { MongoClient } from "mongodb";
import { mongouri } from "../../common";
export async function banuser(id: number): Promise<boolean> {
  const client = new MongoClient(mongouri);
  await client.connect();
  const metahkgusers = client.db("metahkg-users");
  const users = metahkgusers.collection("users");
  const exist = await users.countDocuments({ id: id });
  if (!exist) return false;
  await users.updateOne(
    { id: id },
    {
      $unset: {
        password: 1,
        key: 1,
      },
    }
  );
  return true;
}
export async function banip(ip: string): Promise<boolean> {
  const client = new MongoClient(mongouri);
  await client.connect();
  const banned = client.db("metahkg-users").collection("banned");
  const exist = await banned.countDocuments({ ip: ip });
  if (exist) return false;
  await banned.insertOne({
    ip: ip,
  });
  return true;
}
