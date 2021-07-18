import { Assignment } from './assignment';

export class AlertBean {
	pkAlertId: number=0;
	pkClsnmId: number=0;
	pkAssignmentId: any=0;
	pkGuardianId: number=0;
	pkContactId: number=0;
	pkMethodId: number=0;
	guardianName: string;
	assignmentBean: Assignment = new Assignment();
	mediaVal: string;
	alertStartDateTime: any;
	alertEndDateTime: any;
	alerttime: any;
	repeatDays: number=0;
	alertMessage: string;
	errorMessage: string;
	message: string;
	alertSubject: string;
	alertedStatus: number;
}
