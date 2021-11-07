import faker from "faker"; //IMPORTANT PROBABLY: note "npm i faker" needed to be run to use this, probably will have to mention in the docs/setup.md file; TODO

//TODO
export class Database {
    
    // //takes an array of category names
    // constructor(categories) {
    //     this._data = {}; //placeholder obviously, but for this dummy database just using an object to store everything
    //     for (const c in categories) {
    //         this._data[c] = [];
    //     }
    // }
    constructor() {

    }

    insert(category, element) {
        // this._data[category].push(element);
        //doesn't actually update anything since it's just dummy
    }

    find(category, element) {
        // return this._data[category].find((e) => {
        //     for(const [key,value] of Object.entries(element)) {
        //         if (e[key] !== value) return false;
        //     }
        //     return true;
        // });
        let output = {};
        if (category == "user") {
            output["pass_hash"] = faker.internet.password(); 
            if ("email" in element) {
                output["email"] = element["email"];
            } else {
                output["email"] = faker.internet.email(); 
            }
            output["display_name"] = faker.internet.userName(); 
            output["phone_number"] = faker.phone.phoneNumber(); 
            output["tip_link"] = faker.internet.url(); 
        } else if (category == "task") {
            //TODO generates whatever fake format of data is neede
        } else if (category == "session") {
            if ("token" in element) {
                output["token"] = element["token"];
            } else {
                output["token"] = faker.internet.password(); 
            }
            output["email"] = faker.internet.email(); 
        }
        return output
    }

    findAndUpdate(category, element, updates) {
        // let target = this._data[category].find((e) => {
        //     for(const [key,value] of Object.entries(element)) {
        //         if (e[key] !== value) return false;
        //     }
        //     return true;
        // });
        // for (const [key,value] of Object.entries(updates)) {
        //     target[key] = value;
        // }
        // return target;

        let output = this.find(category, element);
        for (const [key,value] of Object.entries(updates)) {
            output[key] = value;
        }
        return output;
    }

    findAndDelete(category, element) {
        // let targetIndex = this._data[category].findIndex((e) => {
        //     for(const [key,value] of Object.entries(element)) {
        //         if (e[key] != value) return false;
        //     }
        //     return true;
        // });
        // if (targetIndex === -1) {
        //     return null;
        // } else {
        //     return this._data[category].splice(targetIndex, 1);
        // }
        return this.find(category, element); //DOESN'T actually delete anything since this is just dummy
    }
}