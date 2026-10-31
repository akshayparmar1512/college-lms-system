import { EntitySchema } from "typeorm";

export const AssignmentSubmission = new EntitySchema({
    name:"AssignmentSubmission",
    tableName:"assignment_submission",
    columns:{
        submission_id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        assignment_id:{
            type:"uuid"
        },
        student_id:{
            type:"uuid"
        },
        file_url:{
            type:"varchar",
            length:255,
            nullable:false
        },
        status:{
            type:"enum",
            enum:["submitted","late"]
        },
        submitted_at:{
            type:"timestamp with time zone",
        },
        marks_obtained:{
            type:"integer"
        },
        created_at:{
            type:"timestamp with time zone",
            createDate:true
        },
        updated_at:{
            type:"timestamp with time zone",
            updateDate:true
        }
    },
    relations:{
        assignment:{
            type:"many-to-one",
            target:"Assignment",
            inverseSide:"assignmentSubmissions",
            joinColumn:{name:"assignment_id"}
        },
        student:{
            type:"many-to-one",
            target:"StudentProfile",
            inverseSide:"assignmentSubmissions",
            joinColumn:{name:"student_id"}
        }
    }
})