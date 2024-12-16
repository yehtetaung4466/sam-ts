import { StatusCodes } from "http-status-codes";
import HttpException from "../shared/exceptions/http.exception";
import { db } from "/opt/lib/database";
import CommonServiceI from "../shared/interfaces/service.interface";

async function findOne(id:number) {
    const product = await db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, +id),
      });
      if(!product) throw new HttpException(StatusCodes.NOT_FOUND, ["product not found"])
      return product
}

export const productService:CommonServiceI = {
    findOne
}