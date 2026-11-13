import { EntitySchema } from "typeorm";

export const PasswordResetOtp = new EntitySchema({
    name:"PasswordResetOtp",
    tableName:"password_reset_otps",
    columns:{
        otp_id:{
            type:"uuid",
            primary:true,
            generated:"uuid"
        },
        user_id:{
            type:"uuid"
        },
        otp_hash:{
            type:"varchar",
            length:255,
            nullable:false,
            unique:true
        },
        expires_at:{
            type:"timestamp with time zone",
            nullable:false
        },
        attempts:{
            type:"smallint",
            default:0
        },
        is_verified:{
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
            inverseSide:"PasswordResetOtps",
            joinColumn:{name:"user_id"}
        }
    }
})