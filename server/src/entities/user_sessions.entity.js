import { EntitySchema } from "typeorm";

export const UserSession = new EntitySchema({
    name:"UserSession",
    tableName:"user_sessions",
    columns:{
        session_id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        user_id:{
            type:"uuid"
        },
        refresh_token:{
            type:"varchar",
            length:255,
            unique:true,
            nullable:false
        },
        expires_at:{
            type:"timestamp with time zone",
            nullable:false
        },
        revoked_at:{
            type:"timestamp with time zone",
            nullable:true
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
        user:{
            type:"many-to-one",
            target:"User",
            joinColumn:{name:"user_id"},
            inverseSide:"sessions"
        }
    }
})