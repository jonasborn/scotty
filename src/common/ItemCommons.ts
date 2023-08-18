import {ItemApi, ItemProcessApi, ProcessApi} from "../scotty-api";
import {DateCommons} from "./Commons";
import {RuntimeCommons} from "../RuntimeCommons";

export interface ItemDef {
    id: number
    title?: string
    availability?: boolean
    availability_date?: string
    inventory_id?: string
    acquisition_date?: string
    location?: string
    price?: number
    supplier?: string
    comment?: string
}

export class ItemsCommons {

    static search(input: String, limit: number = 10, page: number = 0): Promise<ItemDef[]> {


        console.log(limit)

        const itemApi = new ItemApi()
        const itemProcessApi = new ItemProcessApi()
        const processApi = new ProcessApi()

        let filter1 = []
        let filter2 = []
        if (input !== null) {
            filter1 = [
                "title,cs," + input
            ]
            filter2 = [
                "inventory_id,sw," + input
            ]
        }


        return new Promise((resolve, reject) => {
            itemApi.listItem(
                undefined, filter1, filter2, undefined, undefined, undefined, undefined, undefined, page.toString() + "," + limit
            ).then((response) => {

                RuntimeCommons.serial((itemResult) => {

                    const createObject = (state, availability_date) => {
                        const data: ItemDef = {
                            id: itemResult.id,
                            title: itemResult.title,
                            availability: state,
                            availability_date: availability_date,
                            inventory_id: itemResult.inventory_id,
                            acquisition_date: DateCommons.humanFromDate(DateCommons.dateFromInteger(itemResult.acquisition_date)),
                            location: itemResult.location,
                            price: itemResult.price,
                            supplier: itemResult.supplier,
                            comment: itemResult.comment,
                        }
                        return data
                    }

                    return new Promise<any>((resolve, reject) => {

                        let state = "available"
                        let availability_date = DateCommons.humanFromDate(new Date())

                        console.log(["item,eq," + itemResult.id])
                        //Search for related item-process
                        itemProcessApi.listItemProcess(["item,eq," + itemResult.id]).then((iPResult) => {

                            if (iPResult.body.records.length > 0) {


                                processApi.listProcess(["id,eq," + iPResult.body.records[0].process]).then((p) => {

                                    if (p.body.records.length > 0) {
                                        const found = p.body.records[0]
                                        if (found.end_date !== undefined && found.return_date === null) {
                                            availability_date = DateCommons.humanFromDate(DateCommons.dateFromInteger(found.end_date))
                                            if (new Date().getTime() > found.end_date) {
                                                state = "overdue"
                                            } else {
                                                state = "rented"
                                            }
                                        }
                                    } else {
                                        console.warn("Process with id " + iPResult.body.records[0].id + " missing")
                                    }


                                    resolve(createObject(state, availability_date))

                                })

                            } else {
                                resolve(createObject(state, availability_date))
                            }

                        })

                    })
                }, response.body.records).then(data => {
                    data["_total"] = response.body.results
                    resolve(data)
                }).catch((e) => {
                    reject(e)
                })
            });
        })


    }


}