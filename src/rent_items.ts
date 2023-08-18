import {Template} from "./template";
import * as $ from "jquery";
import {CreateItemProcess, CreateProcess, ItemApi, ItemProcessApi, ProcessApi, ReadItem} from "./scotty-api";
import {DateCommons, ToastCommons} from "./common/Commons";
import {ItemDef, ItemsCommons} from "./common/ItemCommons";
import {UserCommons} from "./common/UserCommons";
import {CacheUtils} from "./util/CacheUtils";
import {RuntimeCommons} from "./RuntimeCommons";


export function rent_items() {

    $("#rentItemSubmit").on("click", () => {
        const papi = new ProcessApi()

        const user = $("#userInput").data("selected")
        const endDate = DateCommons.numberFromString($("#endDateInput").val().toString())
        const comment = $("#commentInput").val().toString()

        const cpe: CreateProcess = {
            manager: 1,
            user: 1,
            begin_date: DateCommons.numberFromDate(new Date()),
            end_date: endDate,
            comment: comment
        }

        papi.createProcess(cpe).then((done) => {

            const items = []
            for (let item of $("#items").children()) {
                items.push($(item).data("element-id"))
            }

            const iapi = new ItemProcessApi()
            RuntimeCommons.serial(function (ident: string) {
                return new Promise(function (resolve, reject) {
                    RentItemDomSearch.getElement(ident).then(function (value) {
                        const entry: CreateItemProcess = {
                            item: value.id,
                            process: done.body
                        }
                        iapi.createItemProcess(entry).then(() => {
                            console.log("Item to process relation with id " + value.id + " was created")
                            resolve()
                        }).catch((e) => {
                            reject(e)
                        })
                    })
                })
            }, items).then(() => {
                ToastCommons.info("Vorgang wurde angelegt")
            }).catch((e) => {
                ToastCommons.error("Vorgang konnte nicht angelegt werden", e)
            })

        }).catch((e) => {
            ToastCommons.error("Vorgang konnte nicht angelegt werden", e)
        })


    })
}

export class RentItemDom {
    static onElementSelect(id) {

        RentItemDomSearch.getElement(id).then((data) => {

            // @ts-ignore
            if (data.availability != "available") {
                ToastCommons.error("Der gewünschte Gegenstand kann aktuell nicht verliehen werden!")
            } else {
                Template.render("rent_items_item.twig", data, function (body) {
                    $("#items").append(body)
                })
            }
        })

    }
}


export class RentItemDomSearch {


    static searchElements(input: String): Promise<any> {
        return new Promise((resolve, reject) => {
            ItemsCommons.search(input).then((data) => {

                for (let entry of data) {
                    CacheUtils.set("rentItemElement", entry.id, entry)
                }

                resolve(data)
            }).catch((e) => {
                reject(e)
            })
        })
    }

    static getElement(id: any): Promise<ReadItem> {
        const ident = id.toString()
        const api = new ItemApi()
        return CacheUtils.get("rentItemElement", ident, function () {
            return new Promise((resolve, reject) => {
                return api.readItem(ident).then(function (r) {
                    resolve(r.body)
                })
            })

        })
    }

    static searchUsers(input: String): Promise<any> {
        return new Promise((resolve, reject) => {
            UserCommons.search(input).then((data) => {
                resolve(data)
            }).catch((e) => {
            }).catch((e) => {
                reject(e)
            })
        })
    }
}

export class RentItemDomRenderer {
    static renderElementsInList(item): Promise<any> {
        return new Promise((resolve, reject) => {
            Template.render(
                "rent_items_item.twig", item, function (body) {
                    item["_removable"] = true
                    resolve(
                        {
                            id: item.id,
                            value: item.id,
                            text: item.inventory_id + " - " + item.title,
                            html: body,
                            item: item

                        }
                    )

                }
            )
        })
    }

    static rentItemsRenderUserInList(item, callback) {
        Template.render(
            "rent_items_user.twig", item, function (body) {
                callback(
                    {
                        id: item.id,
                        value: item.student_id,
                        text: item.student_id + " - " + item.name + " " + item.surname,
                        html: body,
                        item: item
                    }
                )
            }
        )
    }
}