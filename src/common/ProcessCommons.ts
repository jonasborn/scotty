import {
    ItemApi,
    ItemProcessApi,
    ListProcessRecordsInner,
    ListUserRecordsInner,
    ProcessApi,
    UserApi
} from "../scotty-api";
import {RuntimeCommons} from "../RuntimeCommons";
import {DateCommons} from "./Commons";
import {ItemDef} from "./ItemCommons";

export class ProcessDef {
    process: ListProcessRecordsInner
    user: ListUserRecordsInner


    constructor(process: ListProcessRecordsInner, user: ListUserRecordsInner) {
        this.process = process;
        this.user = user;
    }
}

export class ProcessCommons {

    static search(query: String, limit: number = 10, page: number = 0): Promise<ProcessDef[]> {

        query = "Jonas"

        const userApi = new UserApi()
        const processApi = new ProcessApi()

        const filter1 = [
            "student_id,sw," + query
        ]
        const filter2 = [
            "name,sw," + query
        ]
        const filter3 = [
            "surname,sw," + query
        ]

        return new Promise((resolve, reject) => {
            new Promise<any>((resolve, reject) => {
                userApi.listUser(
                    undefined,
                    filter1,
                    filter2,
                    filter3,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    page.toString() + "," + limit
                ).then((userResult) => {
                    const users = userResult.body.records

                    RuntimeCommons.serial((singleUser) => {

                        return new Promise<any>((resolve, reject) => {

                            processApi.listProcess(
                                undefined,
                                ["user,eq," + singleUser.id]
                            ).then((userRelatedProcesses) => {
                                const elements = []
                                userRelatedProcesses.body.records.forEach((singleProcess) => {
                                    elements.push(
                                        new ProcessDef(
                                            singleProcess, singleUser
                                        )
                                    )
                                })
                                resolve(elements)
                            })

                        })


                    }, users).then((allUserRelatedProcesses) => {
                        resolve(allUserRelatedProcesses)
                    })
                })
            }).then((allUserRelatedProcesses) => {

                processApi.listProcess(
                    undefined, ["id,eq," + query], undefined, undefined,
                    undefined, undefined, undefined, undefined, page.toString() + "," + limit, ["user"]
                ).then((allProcesses) => {

                    const results = []
                    allUserRelatedProcesses.forEach((singleEntry) => {
                        results.push(singleEntry)
                    })

                    allProcesses.body.records.forEach((processAndUserEntry) => {
                        results.push(
                            new ProcessDef(
                                processAndUserEntry,
                                processAndUserEntry.user as any
                            )
                        )
                    })

                    resolve(results)

                })

            })
        })


    }

}