class Idict<T> {
    dict

    constructor(dict: { [key: string]: T }) {
        this.dict = dict
    }

    get(key: string): T | undefined {
        for (let k in this.dict) {
            if (key.match(new RegExp("^" + k + "$"))) {
                return this.dict[key]
            }
        }

        return undefined
    }
}
