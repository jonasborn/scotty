import {Template} from "../template";
import * as $ from "jquery";
import {ItemApi, ItemProcessApi, ProcessApi} from "../scotty-api";
import {DateCommons} from "../common/Commons";
import {ItemsCommons} from "../common/ItemCommons";
import {RuntimeCommons} from "../RuntimeCommons";
import {ProcessCommons} from "../common/ProcessCommons";

export function list_processes() {

    let limit = 2
    let page = 1;
    let max = 10;

    const load = function (callback = null) {
        ProcessCommons.search("Hallo")
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