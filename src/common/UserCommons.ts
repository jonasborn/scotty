import {UserApi, UserStateApi} from "../scotty-api";

export class UserCommons {
    static search(query: String): Promise<any> {

        const api = new UserApi()
        const sapi = new UserStateApi()

        return new Promise((resolve, reject) => {
            api.listUser([]
            ).then((r) => {
                const promises = []
                let entry;
                for (entry of r.body.records) {
                    promises.push(
                        new Promise(resolve => {
                            sapi.listUserState().then((rs) => {
                                if (rs.body.records.length > 0) {
                                    if (rs.body.records[0].state == 1) {
                                        entry.state = rs.body.records[0].state
                                        resolve(entry)
                                    }
                                } else {
                                    resolve(entry)
                                }
                            })
                        })
                    )

                    Promise.all(promises).then(
                        function (data) {
                            resolve(data)
                        }
                    ).catch((e) => reject(e))
                }
            })
        })


    }
}