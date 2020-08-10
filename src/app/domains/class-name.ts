import { StudentBean } from './student-bean';
import { ClassdayOfWeek } from './classday-of-week';
export class ClassName {
    pkClsnmId: number;
	student: StudentBean;
	classname: string;
	classtype: string;
	semester: string='';
	instructor: string;
	classroom: string;
	semStartDate: Date;
	semEndDate: Date;
	description: string;
	errorMessage: string;
	message: string;
	classdayOfweek: ClassdayOfWeek[];
}
