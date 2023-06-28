export class CacheUtils {

    static storage = {}
    static storageTimes = {}

    static get(prefix: String, id: String, func: any, timeout = 600000): Promise<any> {

        const ident = prefix + "." + id

        const storage = this.storage
        const storageTimes = this.storageTimes
        const renew = function () {
            return new Promise((resolve, reject) => {
                return func(ident).then((data) => {
                    storage[ident] = data
                    storageTimes[ident] = new Date().getTime()
                    resolve(data)
                })
            })
        }

        const value = this.storage[ident]
        console.log(storage)
        if (value !== undefined) {
            const time = this.storageTimes[ident];

            if (time !== undefined) {
                if (new Date().getTime() - time > timeout) {
                    console.log("No time left")
                    return renew()
                } else {
                    return new Promise((resolve, reject) => {
                        const found = storage[ident]
                        found["_cached"] = time
                        resolve(found)
                    })
                }
            } else {
                console.log("No date found")
                return renew();
            }

        } else {
            console.log("No item found")
            return renew();
        }
    }

    static set(prefix, id, value) {
        const ident = prefix + "." + id
        this.storage[ident] = value
        this.storageTimes[ident] = new Date().getTime()
    }

}
