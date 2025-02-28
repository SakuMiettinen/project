import mongoose, { Document, Schema } from "mongoose"
import { KanbanData } from "./KanbanData"

interface IUser extends Document {
    email: String
    password: String
}

const userSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
})

// On successful user creation, create an empty KanbanData document for the user.
// The KanbanData document will be associated with the user's _id, which can
// be referenced by the JWTPayload user.id in the request on restricted pages.
userSchema.post("save", async function (this: IUser) {
    try {
        const kanbanData = new KanbanData({
            userId: this.id,
            columns: [],
        })

        await kanbanData.save()
        console.log("Successfully created kanbanData document for new user")
    } catch (error) {
        console.error("Error creating KanbanData for new user:", error)
    }
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema)

export { User, IUser }
