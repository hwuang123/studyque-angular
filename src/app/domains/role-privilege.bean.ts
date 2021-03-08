import { PrivilegeBean } from "./privilege-bean";

export class RolePrivilege {
    pkRoleId: number = 0;
    privilegeList: PrivilegeBean[]= [];
    selectedPrivilegeList: PrivilegeBean[]= [];
}
