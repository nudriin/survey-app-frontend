import { ReactNode } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeProvider"
import { Link } from "react-router-dom"
import Logout from "../Logout"
import pky from "../../assets/images/web/pky.png"
export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { setTheme } = useTheme()
    return (
        <section>
            <header>
                <nav className="p-2 mb-2 rounded-lg ">
                    <ul className="flex items-center justify-end gap-2">
                        <li>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">
                                            Toggle theme
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setTheme("light")}
                                    >
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme("dark")}
                                    >
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme("system")}
                                    >
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <li className="flex items-center gap-2">
                            <Button asChild>
                                <Link to="/skm/dashboard">SKM Dashboard</Link>
                            </Button>
                            <Button variant={"outline"} asChild>
                                <Link to="/">Form Builder</Link>
                            </Button>
                            <Button variant={"outline"} asChild>
                                <Link to="/skm/submit">Survei</Link>
                            </Button>
                        </li>
                        <li>
                            <Logout />
                        </li>
                    </ul>
                </nav>
                <div className="items-center justify-center col-span-4 gap-6 p-6 text-white border-2 sm:flex md:text-left bg-purples rounded-xl shadow-box dark:shadow-light border-darks2 dark:border-primary">
                    <div className="order-1 md:order-2">
                        <h1 className="my-3 text-2xl font-bold md:text-4xl">
                            Selamat Datang di Dinas Pendidikan Kota Palangka
                            Raya
                        </h1>
                        <p className="md:text-xl lg:text-2xl">
                            Semoga harimu menyenangkan!
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="order-2 mx-auto h-28 md:h-36 lg:h-48 md:order-1"
                    >
                        <img
                            className="w-[150px] mx-auto my-auto"
                            src={pky}
                            alt=""
                        />
                    </Link>
                </div>
            </header>
            <main>{children}</main>
        </section>
    )
}
