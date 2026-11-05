import {DataSource} from "typeorm"
import { College } from "../entities/College.entity.js"
import { User } from "../entities/user.entity.js"
import { Department } from "../entities/department.entity.js"
import { Subject } from "../entities/subject.entity.js"
import { Curriculum } from "../entities/curriculum.entity.js"
import { CurriculumSubject } from "../entities/curriculum_subject.entity.js"
import { AcademicYear } from "../entities/AcademicYear.entity.js"
import { AcademicCalendar } from "../entities/academic_calendar.entity.js"
import { FacultyProfile } from "../entities/faculty_profile.entity.js"
import { StudentProfile } from "../entities/student_profile.entity.js"
import { StudentEnrollment } from "../entities/student_enrollment.entity.js"
import { FacultySubjectMapping } from "../entities/faculty_subject_mapping.entity.js"
import { Assignment } from "../entities/assignment.entity.js"
import { AssignmentSubmission } from "../entities/assignment_submission.entity.js"
import { StudyMaterial } from "../entities/study_material.entity.js"
import { AttandanceSession } from "../entities/attendance_session.entity.js"
import { StudentAttendance } from "../entities/student_attendance.entity.js"
import { UserSession } from "../entities/user_sessions.entity.js"

//  create datasource that holds our database connection settings and pools
export const AppDataSource = new DataSource({
    type:"postgres",
    // url:process.env.DATABASE_URL,
    // ssl:{
    //     rejectUnauthorized:true
    // },
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    entities:[
        College,
        User,
        Department,
        Subject,
        Curriculum,
        CurriculumSubject,
        AcademicYear,
        AcademicCalendar,
        FacultyProfile,
        StudentProfile,
        StudentEnrollment,
        FacultySubjectMapping,
        Assignment,
        AssignmentSubmission,
        StudyMaterial,
        AttandanceSession,
        StudentAttendance,
        UserSession
    ],
    synchronize:true,
    logging:false
})

export const connectDB = async ()=>{
    try {
        console.time("Database initialization")
        await AppDataSource.initialize()
        console.timeEnd("Database initialization");
        console.log("datasource initialized succesfully")
       
    } catch (error) {
        console.error("database connection error" , error)
        throw error
    }
}