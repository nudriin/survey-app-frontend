import { ReactNode } from 'react';
import tutWuriImg from '../../assets/images/web/tut_wuri.png';
import { Toaster } from '../ui/toaster';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <section>
            <header>
                <div className="sm:flex items-center justify-center md:text-left gap-3 col-span-4 bg-purples rounded-xl text-white p-6 shadow-box border-2 border-darks2">
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
            <Toaster />
        </section>
    );
}
