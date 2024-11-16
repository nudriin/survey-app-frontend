import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <div className="bottom-0 z-50 mt-10 bg-primary rounded-2xl">
            <ul className="flex items-center justify-between p-4 text-lime">
                <li className="text-secondary">
                    &copy; Dinas Pendidikan Kota Palangka Raya 2024
                </li>
                <li className="text-sm text-zinc-900">
                    Developed by{" "}
                    <Link
                        target="_blank"
                        to="https://www.linkedin.com/in/nurdin-%E2%A0%80-a9b862284?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BHqEgixSVRbukPeGSeS5SiA%3D%3D"
                    >
                        Nurdin
                    </Link>
                </li>
            </ul>
        </div>
    )
}
