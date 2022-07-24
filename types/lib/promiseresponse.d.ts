export class PromiseResponse extends Promise<any> {
    constructor(executor: (resolve: (value: any) => void, reject: (reason?: any) => void) => void);
}
