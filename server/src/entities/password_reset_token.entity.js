import { EntitySchema } from "typeorm";

export const PasswordResetToken = new EntitySchema({
    name:"PasswordResetToken",
    tableName:"password_reset_tokens",
    columns:{
        reset_token_id:{
            primary:true,
            type:"uuid",
            generated:"uuid"
        },
        user_id:{
            type:"uuid",
            nullable:false
        },
        token_hash:{
            type:"varchar",
            length:255,
            nullable:false,
            unique:true
        },
        expires_at:{
            type:"timestamp with time zone"
        },
        is_used:{
            type:"boolean",
            default:false
        },
        is_deleted:{
            type:"boolean",
            default:false
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
            inverseSide:"PasswordResetTokens",
            joinColumn:{name:"user_id"}
        }
    }
})