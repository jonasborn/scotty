export class RuntimeCommons {
    static serial<I, O>(func: (input: I) => Promise<O>, data: Array<I>): Promise<Array<O>> {

        const serial = funcs =>
            funcs.reduce((promise, func) =>
                promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([]))

        const funcs = data.map(e => () => func(e))

        return serial(funcs)
    }

    static prom(func: (resolver, rejected) => void) {
        return new Promise(resolve => {
         })
    }


}
