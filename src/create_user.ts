import {Template} from "./template";
import * as $ from 'jquery';
import {CreateUser, UserApi} from "./scotty-api";
import {ErrorCommons, ToastCommons} from "./common/Commons";
export function create_user() {


    $("#createUserSubmit").on("click", function () {

        const api = new UserApi()

        const cu: CreateUser = {
            student_id: $("#studentIdInput").val().toString(),
            email: $("#emailInput").val().toString(),
            name: $("#nameInput").val().toString(),
            surname: $("#surnameInput").val().toString(),
            date: new Date().getTime()
        }

        api.createUser(cu).then(function () {
            ToastCommons.info("Der Benutzer " + $("#nameInput").val().toString() + " wurde angelegt")
            $(':input')
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .prop('checked', false)
                .prop('selected', false);
        }).fail(function (e) {
            ErrorCommons.response(
                "Der Benutzer " + $("#nameInput").val().toString() + " konnte nicht angelegt werden!",
                e
            )
        })


    })

}

