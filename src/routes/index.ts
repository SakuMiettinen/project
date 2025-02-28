import { Request, Response, Router } from "express"
import validateToken from "../middleware/validateToken"
import { User, IUser } from "../models/User"
import { KanbanData, IKanbanData } from "../models/KanbanData"
import { JwtPayload } from "jsonwebtoken"

var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")

const router: Router = Router()

type TUser = {
    name: string
    todos: string[]
}

router.post("/register", async (req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password

    try {
        const existingUser: IUser | null = await User.findOne({
            email: email,
        })

        if (existingUser) {
            res.status(409).json({ msg: "Email already in use" })
        } else {
            const passwordHash = bcrypt.hashSync(password, 8)
            const user = new User({
                email: email,
                password: passwordHash,
            })
            await user.save()
            res.status(201).json({ msg: "User registration successfull" })
        }
    } catch (error) {
        res.json({ error: error })
    }
})

router.post("/login", async (req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password

    const user: IUser | null = await User.findOne({
        email: email,
    })

    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            const SECRET_KEY = process.env.SECRET

            const token = jwt.sign(
                { id: user._id, email: user.email },
                SECRET_KEY
            )

            res.json({ success: true, token: token })
        }
    }
})

router.get(
    "/get-user-kanban-data",
    validateToken,
    async (req: Request, res: Response) => {
        const user = (req as any).user
        try {
            const kanbanData = await KanbanData.findOne({ userId: user.id })
            res.json({ kanbanData })
        } catch (error) {}
    }
)

router.put(
    "/update-user-kanban-data",
    validateToken,
    async (req: Request, res: Response) => {
        const user = (req as any).user
        const columnData = req.body.columnData
        try {
            await KanbanData.findOneAndUpdate(
                { userId: user.id },
                { $set: { columns: columnData } }
            )
            res.json({ msg: "User data updated successfully" })
        } catch (error) {}
    }
)

export default router
