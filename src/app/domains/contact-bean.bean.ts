export class ContactBean {
    pkContactId: number;
	pkMethodId: number=0;
	pkGuardianId: number=0;
    pkStudentId: number;
	firstName: string;
	lastName: string;
	mediaVal: string;
	contactMethod: string;
	email: string;
	phone: string;
	relationship: string;
	isStudentContact: string="No";
	errorMessage: string;
	message: string;
}


