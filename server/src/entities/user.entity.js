import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
    name:"User",
    tableName:"users",
    columns:{
        user_id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        full_name:{
            type:"varchar",
            length:255,
            nullable:false
        },
        email:{
            type:"varchar",
            length:255,
            unique:true,
            nullable:false
        },
        password:{
            type:"varchar",
            length:255,
            nullable:false
        },
        role:{
            type:"enum",
            enum:["admin","faculty","student"],
            nullable:false
        },
        status:{
            type:"enum",
            enum:["active","inactive"],
            default:"active",
            nullable:false
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
        college:{
            type:"many-to-one",
            target:"College",
            inverseSide:"users",
            joinColumn:{name:"college_id"},
            nullable:false,
            onDelete:"CASCADE"
        }
    }
})