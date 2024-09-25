import { ReactNode } from 'react';
import tutWuriImg from '../../assets/images/web/tut_wuri.png';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';
import { Link } from 'react-router-dom';
export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { setTheme } = useTheme();
    return (
        <section>
            <header>
                <nav className="mb-2 rounded-lg p-2 ">
                    <ul className="flex justify-end gap-2 items-center">
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
                                        onClick={() => setTheme('light')}
                                    >
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme('dark')}
                                    >
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme('system')}
                                    >
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <li>
                            <Button variant={'outline'} asChild>
                                <Link to="/">Dashboard</Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant={'destructive'}>Logout</Button>
                        </li>
                    </ul>
                </nav>
                <div className="sm:flex items-center justify-center md:text-left gap-3 col-span-4 bg-purples rounded-xl text-white p-6 shadow-box dark:shadow-light border-2 border-darks2 dark:border-primary">
                    <div>
                        <p></p>
                        <h1 className="text-2xl md:text-4xl font-bold my-3">
                            Selamat Datang di Dinas Pendidikan Kota Palangka
                            Raya
                        </h1>
                        <p className="md:text-xl lg:text-2xl">
                            Semoga harimu menyenangkan!
                        </p>
                    </div>
                    <img
                        className="h-28 md:h-36 lg:h-48 order-2 md:order-1 mx-auto"
                        src={tutWuriImg}
                        alt=""
                    />
                </div>
            </header>
            <main>{children}</main>
        </section>
    );
}
