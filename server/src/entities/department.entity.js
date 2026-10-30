import { EntitySchema } from "typeorm";

export const Department = new EntitySchema({
    name:"Department",
    tableName:"departments",
    columns:{
        department_id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        name:{
            type:"varchar",
            length:255,
            nullable:false,
        },
        short_code:{
            type:"varchar",
            length:30,
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
            inverseSide:"departments",
            joinColumn:{name:"college_id"},
            nullable:false,
            
        },
        curriculums:{
            type:"one-to-many",
            target:"Curriculum",
            inverseSide:"department",
        }
    },
    uniques:[
        {
            name: "UQ_department_college_shortcode",
            columns:["college","short_code"]
        }
    ]

    
})