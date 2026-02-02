import { MongoClient } from "mongodb";

const uri =
  "mongodb://me:Uyei49vM7BzXtLp@ip-172-35-134-197.ap-southeast-1.compute.internal:27017," +
  "ip-172-35-140-245.ap-southeast-1.compute.internal:27017," +
  "ip-172-35-136-61.ap-southeast-1.compute.internal:27017/" +
  "?authSource=admin&replicaSet=staging-fullfillment-mgr";

export async function getOrdersInJan2026(dbName) {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const ordersCol = db.collection("orders");

    // khoảng thời gian tháng 01/2026 (UTC)
    const start = new Date("2026-01-01T00:00:00.000Z");
    const end = new Date("2026-02-01T00:00:00.000Z");

    const orders = await ordersCol
      .find({
        created: {
          $gte: start,
          $lt: end,
        },
      })
      .toArray();

    return orders;
  } finally {
    await client.close();
  }
}
