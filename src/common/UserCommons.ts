import {UserApi, UserStateApi} from "../scotty-api";
import {RuntimeCommons} from "../RuntimeCommons";

export class UserCommons {
    static search(query: String): Promise<any> {

        const api = new UserApi()
        const sapi = new UserStateApi()

        let filter1 = []
        let filter2 = []
        let filter3 = []

        if (query !== null) {
            filter1 = [
                "student_id,sw," + query
            ]
            filter2 = [
                "name,sw," + query
            ]
            filter3 = [
                "surname,sw," + query
            ]
        }

        return new Promise((resolve, reject) => {
            api.listUser(undefined, filter1, filter2, filter3
            ).then((r) => {

                RuntimeCommons.serial((e) => {
                    return new Promise<any>((resolve, reject) => {
                        sapi.listUserState().then((rs) => {
                            if (rs.body.records.length > 0) {
                                if (rs.body.records[0].state == 1) {
                                    // @ts-ignore
                                    e.state = rs.body.records[0].state
                                    resolve(e)
                                }
                            } else {
                                resolve(e)
                            }
                        })
                    });
                }, r.body.records).then(data => {
                    resolve(data)
                }).catch((e) => {
                    reject(e)
                })
            }).catch(e => {
                reject(e)
            })
        })

    }
}