import {Template} from "./template";
import * as $ from 'jquery';
import {CreateItem, CreateUser, ItemApi, UserApi} from "./scotty-api";
import {ErrorCommons, ToastCommons} from "./common/Commons";
export function add_item() {


    $("#addItemSubmit").on("click", function () {

        const api = new ItemApi()

        const dateParts = $("#acquisitionInput").val().toString().split(".")
        const date = new Date(Number(dateParts[0]), Number(dateParts[1]), Number(dateParts[2]))

        const ia: CreateItem = {
            inventory_id: $("#inventoryIdInput").val().toString(),
            title: $("#titleInput").val().toString(),
            location: $("#locationInput").val().toString(),
            acquisition_date: date.getTime(),
            price: parseFloat($("#priceInput").val().toString().replace(",", ".")),
            supplier: $("#supplierInput").val().toString(),
            comment:  $("#commentInput").val().toString(),
            date:  new Date().getTime()
        }

        api.createItem(ia).then(() => {
            ToastCommons.info("Das Item wurde erfolgreich angelegt")
            $(':input')
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .prop('checked', false)
                .prop('selected', false);
        }).fail((e) => {
            ErrorCommons.response("Das Item konnte nicht angelegt werden", e)
        })


    })

}

