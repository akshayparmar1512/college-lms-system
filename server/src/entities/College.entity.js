
import { EntitySchema } from "typeorm";

export const College = new EntitySchema({
    name: "College",
    tableName: "colleges",
    columns: {

        college_id: {
            primary: true,
            type: "uuid",
            generated: "uuid"
        },

        name: {
            type: "varchar",
            length: 255,
            nullable: false
        },

        aicte_id: {
            type: "varchar",
            length: 50,
            unique: true,
            nullable: true
        },

        slug: {
            type: "varchar",
            length: 100,
            unique: true,
            nullable: false
        },

        logo_url: {
            type: "varchar",
            length: 500,
            nullable: false
        },

        status: {
            type: "enum",
            enum: ["active", "inactive", "suspended"],
            default: "active",
            nullable: false
        },

        created_at: {
            type: "timestamp with time zone",
            createDate: true
        },

        updated_at: {
            type: "timestamp with time zone",
            updateDate: true
        },
       
    },
    relations:{
        users:{
            type:"one-to-many",
            target:"User",
            inverseSide:"college"
        }
    }
})