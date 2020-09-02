import { StudentBean } from './student-bean';

export class AssignmentType {
    pkId: number;
	student: StudentBean;
	assignment: string;
	description: string;
	errorMessage: string;
	message: string;
}
