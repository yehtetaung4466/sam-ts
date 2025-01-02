import { StatusCodes } from "http-status-codes";
import HttpException from "../shared/exceptions/http.exception";
import { db, schema } from "/opt/lib/database";
import { Product, ProductCreate } from "../lib/database/schema";

async function findOne(id:number) {
    const product = await db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, +id),
      });
      if(!product) throw new HttpException(StatusCodes.NOT_FOUND, ["product not found"])
      return product
}

async function createOne(data: ProductCreate) {
    
    await db.insert(schema.product).values(data)
    //
}

export default {
    findOne,
    createOne
}