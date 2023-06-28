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

        const iapi = new ItemApi()
        const piapi = new ItemProcessApi()
        const papi = new ProcessApi()

        return  new Promise((resolve, reject) => {
            iapi.listItem(
                undefined, undefined, undefined, undefined, undefined, page.toString() + "," + limit
            ).then((response) => {

               RuntimeCommons.serial((e) => {

                   const createObject = function (state, availability_date) {
                       const data: ItemDef = {
                           id: e.id,
                           title: e.title,
                           availability: state,
                           availability_date: availability_date,
                           inventory_id: e.inventory_id,
                           acquisition_date: DateCommons.humanFromDate(DateCommons.dateFromInteger(e.acquisition_date)),
                           location: e.location,
                           price: e.price,
                           supplier: e.supplier,
                           comment: e.comment,
                       }
                       return data
                   }

                  return new Promise<any>((resolve, reject) => {

                      let state = "available"
                      let availability_date = DateCommons.humanFromDate(new Date())

                      //Search for related item-process
                      piapi.listItemProcess(["item,eq," + e.id]).then((pi) => {

                          if (pi.body.records.length > 0) {
                              console.log("Process ref found")

                              papi.listProcess(["id,eq," + pi.body.records[0].id]).then((p) => {

                                  if (p.body.records.length > 0) {

                                      console.log("Process found")

                                      const found = p.body.records[0]
                                      if (found.end_date !== undefined && found.return_date === null) {
                                          availability_date = DateCommons.humanFromDate(DateCommons.dateFromInteger(found.end_date))
                                          if (new Date().getTime() > found.end_date) {
                                              state = "overdue"
                                          } else {
                                              state = "rented"
                                          }
                                      }
                                  }


                                  resolve(createObject(state, availability_date))

                              })

                          } else {
                              resolve(createObject(state, availability_date))
                          }

                      })

                  })
               }, response.body.records).then(function (data) {
                   data["_total"] = response.body.results
                   resolve(data)
               })
            });
        })




    }




}