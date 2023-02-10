const crypto = require("crypto")

Object.equals = (origin, target) => {
    const originHash = Object.getHashCode(origin);
    const targetHash = Object.getHashCode(target);
    return originHash === targetHash;
}

Object.getHashCode = (origin) => {
    let hash = "";

    for (const key in origin) {
        if (Object.prototype.hasOwnProperty.call(origin, key)) {
            const element = origin[key];

            if (typeof element === "object" && Object.keys(element).length > 0) {
                const nestedHash =  Object.getHashCode(element)
                hash += nestedHash;
            } else {
                const hc = key + element;
                const hashPart = crypto.createHash("sha256").update(hc).digest("hex");
                hash += hashPart;
            }
        }
    }

    return hash;
}

class ExtendedMap extends Map {

    constructor(data) {
        super(data)
    }

    get(k) {
        if (typeof k === "object") {
            const hash = Object.getHashCode(k);
            return super.get(hash)
        } else {
            return super.get(k)
        }
    }

    set(k, v) {
        if (typeof k === "object") {
            const hash = String(Object.getHashCode(k));
            if (hash.length > 0) {
                super.set(hash, v)
            } else {
                throw Error("Using an empty object as a key is not allowed")
            }
        } else {
            super.set(k, v) 
        }
    }
}
const Anatoly = {name: "Anatoly", friend: 2};
const Anatoly2 = {name: "Anatoly", friend: 2};

console.log(Object.equals(Anatoly, Anatoly2))

const karta = new ExtendedMap();

karta.set("Kirill", {name: "Kirill", friend: "Anatoly"})
karta.set(Anatoly, "Anatoly")
