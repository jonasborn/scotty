import {Template} from "./template";
import * as $ from "jquery";
import {ItemApi, ItemProcessApi, ProcessApi} from "./scotty-api";
import {DateCommons} from "./common/Commons";
import {ItemsCommons} from "./common/ItemCommons";
import {RuntimeCommons} from "./RuntimeCommons";

export function list_items() {

    let limit = 2
    let page = 1;
    let max = 10;

    const load = function (callback = null) {
        ItemsCommons.search($("#searchInput").val().toString(), limit, page).then((data) => {
            max = Math.ceil(data["_total"] / limit)
            RuntimeCommons.serial((e) => {
                return new Promise((resolve, reject) => {
                    Template.render(
                        "rent_items_item.twig", {
                            id: e.id,
                            title: e.title,
                            availability: e.availability,
                            availability_date: e.availability_date,
                            inventory_id: e.inventory_id,
                            acquisition_date: e.acquisition_date,
                            location: e.location,
                            price: e.price,
                            supplier: e.supplier,
                            comment: e.comment
                        }, function (body) {
                            $("#searchResults").append(body)

                            console.log("Current page " + page + " of " + max)
                            if (page > max) {
                                $("#moreItems").prop("disabled", true)
                            }
                            resolve()
                        }
                    )
                })
            }, data).then((list) => {
                if (callback != null) {
                    callback()
                }
            })
        })
    }

    let timer = null

    $("#searchButton").on("click", function () {
        $(this).prop("disabled", true)
        $("#progress").show()
        if (timer !== null) {
            clearTimeout(timer)
        }

        setTimeout(function () {
            $("#searchResults").empty()
            page = 0
            load(function () {
                $("#searchButton").prop("disabled", false)
                $("#progress").hide()
            })
        }, 1000)

    })


    load()
    page++

    $("#moreItems").on("click", function () {
        load()
        page++
    })


}