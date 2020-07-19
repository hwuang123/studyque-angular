import { GuardianBean } from './guardian-bean';
import { SchoolBean } from './school-bean';
import { StudentBean } from './student-bean';
export class UserProfile {
             orderTerm: string;
             userName: string;
             password: string;
             confirmPassword: string;
             studentBean: StudentBean;
             schoolBean: SchoolBean;
             guardianBean: GuardianBean;
             userAccount: {};
             hasAdminRole: string ="N";
             message: string='';
             errorMessage: string='';
}
