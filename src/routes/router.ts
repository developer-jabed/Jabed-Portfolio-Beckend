import { Router } from "express"
import { UserRoutes } from "../modules/users/user.route"
import { AuthRoutes } from "../modules/Auth/auth.route"
import { blogRoute } from "../modules/blog/blog.route"
import { ProjectRoutes } from "../modules/projects/project.route"
import { MessageRoute } from "../modules/message/message.route"



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
    },
    {
        path: "/project",
        route: ProjectRoutes,
    },
    {
        path: "/message",
        route: MessageRoute,
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})