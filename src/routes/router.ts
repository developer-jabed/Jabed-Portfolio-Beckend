import { Router } from "express"
import { UserRoutes } from "../modules/users/user.route"
import { AuthRoutes } from "../modules/Auth/auth.route"
import { blogRoute } from "../modules/blog/blog.route"



export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/blog",
        route: blogRoute,
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})