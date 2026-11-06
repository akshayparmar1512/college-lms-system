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
        college_id:{
            type:"uuid"
        },
        user_id:{
            type:"uuid"
        },
        refresh_token:{
            type:"text",
            unique:true,
            nullable:false
        },
        expires_at:{
            type:"timestamp with time zone",
            nullable:false
        },
        user_agent:{
            type:"varchar",
            length:255,
            nullable:false
        },
        ip_address:{
            type:"varchar",
            length:255,
            nullable:false
        },
        is_revoked:{
            type:"boolean",
            default:false
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
        },
        college:{
            type:"many-to-one",
            target:"College",
            joinColumn:{name:"college_id"},
            inverseSide:"sessions"
        }
    }
})