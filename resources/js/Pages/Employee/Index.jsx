import { router } from '@inertiajs/react';
import { useState } from 'react';
import FlashMessage from '@/Components/FlashMessage';
import { usePage } from '@inertiajs/react';

//query = ค่าของการค้นหาที่ส่งกลับมาจาก controller
//employees  = ข้อมูลพนักงานที่ส่งกลับมาจาก controller

export default function Index({ employees, query }) {
    const [search, setSearch] = useState(query || '');
    const [sortConfig, setSortConfig] = useState({ key: 'emp_no', direction: 'asc' });
    const { flash } = usePage().props;
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        //Search ค่าที่เรากรอกในช่อง input
        router.get('/employee', { search, searchBy: 'last_name' }, {
            preserveState: true,
            onSuccess: () => {
                setSearch(search);
            }
        });
    };

    const sortedEmployees = [...employees.data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <FlashMessage flash={flash} />
            <h1 className="text-2xl font-bold mb-4">Employee List</h1>

            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Search
                </button>
            </form>

            {employees.data.length === 0 ? (
                <p className="text-red-500">No data found</p>
            ) : (
                <>
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b" onClick={() => handleSort('emp_no')}>ID</th>
                                <th className="py-2 px-4 border-b" onClick={() => handleSort('first_name')}>FirstName</th>
                                <th className="py-2 px-4 border-b" onClick={() => handleSort('last_name')}>LastName</th>
                                <th className="py-2 px-4 border-b" onClick={() => handleSort('gender')}>Gender</th>
                                <th className="py-2 px-4 border-b" onClick={() => handleSort('birth_date')}>Birth Date</th>
                                <th className="py-2 px-4 border-b" onClick={() => handleSort('hire_date')}>Hire Date</th>
                                <th className="py-2 px-4 border-b">Photo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedEmployees.map((employee, index)=> (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center">{employee.emp_no}</td>
                                    <td className="py-2 px-4 border-b text-center cursor-pointer" onClick={() => setSelectedPhoto(employee.photo)}>
                                        {employee.first_name}
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">{employee.last_name}</td>
                                    <td className="py-2 px-4 border-b text-center">{employee.gender === 'M'? 'Male': 'Female'}</td>
                                    <td className="py-2 px-4 border-b text-center">{employee.birth_date}</td>
                                    <td className="py-2 px-4 border-b text-center">{employee.hire_date}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {employee.photo && (
                                            <img
                                                src={`storage/${employee.photo}`}
                                                alt="Employee Photo"
                                                className="h-10 w-10 object-cover rounded-full"
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={() => router.get(employees.prev_page_url, { search, searchBy: 'last_name' },{
                                preserveState: true,
                                onSuccess: () => {
                                    setSearch(search);
                                }
                            })}
                            disabled={!employees.prev_page_url}
                            className="bg-gray-300 text-gray-700 p-2 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {employees.current_page} of {employees.last_page}</span>
                        <button
                            onClick={() => router.get(employees.next_page_url, { search, searchBy: 'last_name' },{
                                preserveState: true,
                                onSuccess: () => {
                                    setSearch(search);
                                }
                            })}
                            disabled={!employees.next_page_url}
                            className="bg-gray-300 text-gray-700 p-2 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded">
                        <img src={`/storage/${selectedPhoto}`} alt="Employee Photo" className="h-40 w-40 object-cover rounded-full" />
                        <button onClick={() => setSelectedPhoto(null)} className="mt-4 bg-red-500 text-white p-2 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
