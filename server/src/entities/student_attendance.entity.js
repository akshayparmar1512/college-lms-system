import { EntitySchema } from "typeorm";

export const StudentAttendance = new EntitySchema({
    name:"StudentAttendance",
    tableName:"student_attendance",
    columns:{
        attendance_id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        session_id:{
            type:"uuid"
        },
        student_id:{
            type:"uuid"
        },
        is_present:{
            type:"boolean",
            default:true
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
        attendanceSession:{
            type:"many-to-one",
            target:"AttandanceSession",
            inverseSide:"studentAttendances",
            joinColumn:{name:"session_id"}
        },
        student:{
            type:"many-to-one",
            target:"StudentProfile",
            inverseSide:"studentAttendances",
            joinColumn:{name:"student_id"}
        }
    }
})