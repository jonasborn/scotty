import {Template} from "./template";
import * as $ from 'jquery';

class Page {

    constructor(title: String, url: String) {
        this.title = title;
        this.url = url;
    }

    title: String
    url: String
}

const available = [
    new Page(
        "Home", "index.html"
    ),
    new Page(
        "Alle Elemente", "list_items.html"
    ),
    new Page("Neuer Vorgang", "rent_items.html")
]

export function navbar(page: String, element: String) {
    Template.render(
        "navbar.twig", {
            "available": available
        }, function (body) {
            $("#" + element).html(body)
        }
    )
}
