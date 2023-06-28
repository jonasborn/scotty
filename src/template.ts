import {twig} from "twig";
import * as $ from 'jquery';

export class Template {
    static render(file: string, opt: any, success: (string) => void): void{
        $.get(file).then(function (data) {
            const template = twig({
                "data": data
            })
            success(template.render(opt))
        })
    }

}