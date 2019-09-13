export class UserInfoModel {
    guid: string;
    customerUid: string;

    firstName: string;
    lastName: string;

    email: string;
    zipcode: string;

    password: string;

    constructor(obj: any = null) {
        if (obj != null) {
            Object.assign(this, obj);
        }
    }
}
