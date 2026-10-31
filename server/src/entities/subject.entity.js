import { EntitySchema } from "typeorm";

export const Subject = new EntitySchema({
    name:"Subject",
    tableName:"subjects",
    columns:{
        subject_id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        name:{
            type:"varchar",
            length:255,
            nullable:false
        },
        code:{
            type:"varchar",
            length:50,
            nullable:false
        },
        created_at:{
            type:"timestamp with time zone",
            createDate:true
        },
        updated_at:{
            type:"timestamp with time zone",
            updateDate:true
        },
        deleted_at:{
            type:"timestamp with time zone",
            deleteDate:true
        }
    },
    relations:{
        college:{
            type:"many-to-one",
            target:"College",
            inverseSide:"subjects",
            joinColumn:{name:"college_id"},
            nullable:false
        },
        curriculumSubjects:{
            type:"one-to-many",
            target:"CurriculumSubject",
            inverseSide:"subject",
        },
         facultySubjectMappings:{
            type:"one-to-many",
            target:"FacultySubjectMapping",
            inverseSide:"subject"
        },
          assignments:{
            type:"one-to-many",
            target:"Assignment",
            inverseSide:"subject"
        },
         studyMaterials:{
            type:"one-to-many",
            target:"StudyMaterial",
            inverseSide:"subject"
        },
         attandanceSessions:{
            type:"one-to-many",
            target:"AttandanceSession",
            inverseSide:"subject"
        },
          
    },
    uniques:[
        {
            name:"UQ-college-subject-code",
            columns:["college","code"]
        }
    ]

})