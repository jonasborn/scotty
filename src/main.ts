// noinspection ES6PreferShortImport
import {CreateUser, UserApi} from "./scotty-api/index";
import {create_user} from "./create_user";
import {add_item} from "./add_item";
import {navbar} from "./navbar";
import {list_items} from "./list_items";
import * as $ from 'jquery';
import {twig} from "twig";
import {DateCommons} from "./common/Commons";
import {rent_items, RentItemDomSearch, RentItemDomRenderer, RentItemDom} from "./rent_items";
import {rent_item_receipt} from "./rent_item_receipt";

import {RuntimeCommons} from "./RuntimeCommons";

//const template = twig({

//})

export function  cdate(input: String) {
    console.log(DateCommons.numberFromDate(DateCommons.dateFromString(input)))
}

export {
    create_user,
    add_item,
    list_items,
    navbar,
    rent_items,


    rent_item_receipt,
    RuntimeCommons,
    RentItemDomRenderer,
    RentItemDomSearch,
    RentItemDom
}

