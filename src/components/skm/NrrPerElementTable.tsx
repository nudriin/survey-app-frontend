export default function NrrPerElementTable() {
    return (
        <div className="p-4 overflow-hidden border-2 rounded-lg shadow-box dark:shadow-light border-darks2">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-white bg-purples">
                        <th className="px-4 border-2 border-primary">No</th>
                        <th className="px-4 border-2 border-primary">
                            Unsur Pelayanan
                        </th>
                        <th className="px-4 border-2 border-primary">Nrr</th>
                        <th className="px-4 border-2 border-primary">
                            Keterangan
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-4 border-2 border-primary">1</td>
                        <td className="px-4 border-2 border-primary">
                            Persyaratan
                        </td>
                        <td className="px-4 border-2 border-primary">3.385</td>
                        <td className="px-4 border-2 border-primary">Baik</td>
                    </tr>
                    <tr>
                        <td className="px-4 border-2 border-primary">2</td>
                        <td className="px-4 border-2 border-primary">
                            Prosedur
                        </td>
                        <td className="px-4 border-2 border-primary">3.381</td>
                        <td className="px-4 border-2 border-primary">Baik</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
