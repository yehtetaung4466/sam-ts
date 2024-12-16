import ResponseObj from "../classes/ResponseObj";

export default interface CommonServiceI{
    findOne(id:number):Promise<any>,
}