import { EntitySchema } from "typeorm";

export const CurriculumSubject = new EntitySchema({
    name:"CurriculumSubject",
    tableName:"curriculum_subjects",
    columns:{
        subject_id:{
            type:"uuid",
            primary:true
        },
        curriculum_id:{
            type:"uuid",
            primary:true
        },
        status:{
            type:"enum",
            enum:["active","inactive"],
            default:"active",
            nullable:false,
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
        subject:{
            type:"many-to-one",
            target:"Subject",
            inverseSide:"curriculumSubjects",
            joinColumn:{name:"subject_id"},
            primary:true,
            nullable:false,
            onDelete:"RESTRICT"
        },
        curriculum:{
            type:"many-to-one",
            target:"Curriculum",
            inverseSide:"curriculumSubjects",
            joinColumn:{name:"curriculum_id"},
            primary:true,
            nullable:false,
            onDelete:"RESTRICT"
        }
    }
    
})