import mongoose, { Document, Schema } from "mongoose"

interface IKanbanData extends Document {
    userId: mongoose.Schema.Types.ObjectId
    columns: IKanbanColumn[]
}

interface IKanbanColumn extends Document {
    id: number
    title: string
    cards: IKanbanCard[]
}

interface IKanbanCard extends Document {
    id: number
    title: string
    details: string
}

const kanbanCardSchema: Schema = new Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    details: { type: String, required: true },
})

const kanbanColumnSchema: Schema = new Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    cards: { type: [kanbanCardSchema], required: false },
})

const kanbanDataSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    columns: { type: [kanbanColumnSchema], required: false },
})

const KanbanData: mongoose.Model<IKanbanData> = mongoose.model<IKanbanData>(
    "KanbanData",
    kanbanDataSchema
)

export { KanbanData, IKanbanData }
