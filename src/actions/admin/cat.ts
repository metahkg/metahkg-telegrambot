import { MongoClient } from "mongodb";
import { mongouri } from "../../common";
import system from "system-commands";
export async function addcat(
  cat: string,
  id?: number,
  wcyat?: boolean
): Promise<boolean> {
  const client = new MongoClient(mongouri);
  await client.connect();
  const category = client.db("metahkg-threads").collection("category");
  const exists =
    (await category.countDocuments({ name: cat })) ||
    (await category.countDocuments({ id: id }));
  if (exists) return false;
  const newid =
    id ||
    (await category.find({}).sort({ id: -1 }).limit(1).toArray())[0].id + 1;
  await category.insertOne({ id: newid, name: cat });
  if (wcyat)
    system("cd ../metahkg-web && yarn run build && forever restartall");
  return true;
}
export async function rmcat(id: number, wcyat?: boolean): Promise<boolean> {
  const client = new MongoClient(mongouri);
  await client.connect();
  const category = client.db("metahkg-threads").collection("category");
  const exists = await category.countDocuments({ id: id });
  if (!exists) return false;
  await category.deleteOne({ id: id });
  if (wcyat)
    system("cd ../metahkg-web && yarn run build && forever restartall");
  return true;
}
