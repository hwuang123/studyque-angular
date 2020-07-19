import { AssignmentType } from './assignment-type';
import { ClassName } from './class-name';

export class Assignment {
     pkAssignmentId: number;
	 classname: ClassName;
     assignmenttype: AssignmentType;
     dueDate: Date;
	 description: String;
	 dueDayofweek: String ;
}
