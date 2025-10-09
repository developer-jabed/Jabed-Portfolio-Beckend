import { Router } from "express"
import { UserRoutes } from "../modules/users/user.route"
import { AuthRoutes } from "../modules/Auth/auth.route"



export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes,
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})