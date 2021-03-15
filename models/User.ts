import { Schema, Document, model } from "mongoose"

export interface IUser extends Document {
    psid: string
    firstName: string
    lastName: string
    locale?: string
    timezone?: number
    gender?: string
}

const UserSchema = new Schema<IUser>({
    psid: {
        type: String,
        required: true,
        index: true
    },
    firstName: String,
    lastName: String,
    locale: {
        type: String,
        default: "en_US"
    },
    timezone: String,
    gender: {
        type: String,
        default: "neutral"
    },
})

const User = model<IUser>('users', UserSchema)

export default User;