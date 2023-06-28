import * as $ from "jquery";

export class DateCommons {
    static dateFromString(input: String): Date {
        const parts = input.match(/(\d+)/g);
        return new Date(Number(parts[2]), Number(parts[1])-1, Number(parts[0]));
    }

    static dateFromInteger(input: Number): Date {
        //@ts-ignore
        return new Date(input)
    }

    static numberFromDate(input: Date) {
        return input.getTime()
    }

    static humanFromDate(input: Date) {
        return input.getDate() + "." + (input.getMonth() + 1) + "." + input.getFullYear()
    }

    static numberFromString(input: String) {
        return this.numberFromDate(this.dateFromString(input))
    }

}

export class ErrorCommons {
    static response(message: String, e: any) {

        //@ts-nocheck
        //@ts-ignore
        if (e !== undefined && e.response !== undefined) {
            //@ts-ignore
            message = message + " - Code " + e.response.responseJSON.code
        }
        ToastCommons.error(message)
        console.log(message)
    }
}

export class ToastCommons {
    static info(text: String, duration: Number = 5000) {
        //@ts-nocheck
        //@ts-ignore
        Toastify({
            text: text,
            duration: duration,
            style: {
                background: "#4bbf73",
            }
        }).showToast();
    }

    static warn(text: String, duration: Number = 5000) {
        //@ts-nocheck
        //@ts-ignore
        Toastify({
            text: text,
            duration: duration,
            style: {
                background: "#f0ad4e",
            }
        }).showToast();
    }

    static error(text: String, duration: Number = 15000) {
        //@ts-nocheck
        //@ts-ignore
        Toastify({
            text: text,
            duration: duration,
            style: {
                background: "#ae423f",
            }
        }).showToast();
    }
}