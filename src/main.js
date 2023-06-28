import "scotty-api/index";
// noinspection ES6PreferShortImport
import { UsersApi } from "./scotty-api/index";
jQuery("#test").on("click", function () {
    console.log("Hell yea");
});
const api = new UsersApi();
api.createUsers(new class {
});
