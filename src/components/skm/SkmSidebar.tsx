import { cn } from "@/lib/utils"
import { NavLink } from "react-router-dom"

export default function SkmSidebar() {
    const isPageActive = "bg-white text-purples"
    return (
        <aside className="bg-purples rounded-xl w-[300px] flex flex-col p-4 text-white font-semibold items-start h-full min-h-screen shadow-box dark:shadow-light border-darks2 dark:border-primary gap-2">
            <NavLink
                to="/skm/dashboard"
                className={({ isActive }) =>
                    cn(
                        "w-full px-4 py-2 text-left hover:bg-white hover:text-purples rounded-xl",
                        isActive && isPageActive
                    )
                }
            >
                Dashboard
            </NavLink>
            <NavLink
                to="/skm/question"
                className={({ isActive }) =>
                    cn(
                        "w-full px-4 py-2 text-left hover:bg-white hover:text-purples rounded-xl",
                        isActive && isPageActive
                    )
                }
            >
                Pertanyaan
            </NavLink>
            <NavLink
                to="/skm/response"
                className={({ isActive }) =>
                    cn(
                        "w-full px-4 py-2 text-left hover:bg-white hover:text-purples rounded-xl",
                        isActive && isPageActive
                    )
                }
            >
                Respon Pengguna
            </NavLink>
            <NavLink
                to="/skm/result"
                className={({ isActive }) =>
                    cn(
                        "w-full px-4 py-2 text-left hover:bg-white hover:text-purples rounded-xl",
                        isActive && isPageActive
                    )
                }
            >
                Hasil Survei
            </NavLink>
            <NavLink
                to="/skm/users"
                className={({ isActive }) =>
                    cn(
                        "w-full px-4 py-2 text-left hover:bg-white hover:text-purples rounded-xl",
                        isActive && isPageActive
                    )
                }
            >
                User & Admin
            </NavLink>
        </aside>
    )
}
