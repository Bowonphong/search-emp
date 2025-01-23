<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class Employeecontroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('search'); // หาข้อความได้ทั้งชื่อหรือนามสกุล
        $employees = DB::table('employees')
            ->where('first_name', 'like', '%'. $query. '%')
            ->orWhere('last_name', 'like', '%'. $query. '%')
            ->orWhere('emp_no', $query)
            ->select('emp_no', 'first_name', 'last_name', 'birth_date', 'gender', 'hire_date', 'photo')
            ->paginate(10);

        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'query' => $query,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // ดึงรายชื่อแผนกจากฐานข้อมูล เพื่อไปแสดงให้เลือกรายการในแบบฟอร์ม
        $departments = DB::table('departments')->get();

        // ส่งข้อมูลไปยังหน้า Inertia
        return inertia('Employee/Create', ['departments' => $departments]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        try {
            // Validated Data;
            $validated = $request->validate([
                'first_name' => 'required',
                'last_name' => 'required',
                'birth_date' => 'required',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('photos', 'public');
            }
            // Insert Data to Database;
            DB::transaction(function () use ($validated, $photoPath) {

                //หาค่า emp_no ล่าสุด
                $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0; // ถ้าไม่มีข้อมูล ให้เริ่มที่ 0
                $newEmpNo = $latestEmpNo + 1; // ค่าล่าสุด +1

                //เพิ่มข้อมูลลงในตาราง employees
                DB::table('employees')->insert([
                    'emp_no' => $newEmpNo,
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'birth_date' => $validated['birth_date'],
                    'gender' => $validated['gender'] ?? 'M',
                    'hire_date' => $validated['hire_date'] ?? now(),
                    'photo' => $photoPath,
                ]);
            });
            return redirect()->route('employee.index')->with('success', 'Employee created successfully.');

    } catch (\Exception $e) {
        // ถ้าการทำงานผิดพลาด ให้กลับไปหน้าเดิม โดยกำหนดค่าข้อความ error
        return back()->with('error', 'Failed to create employee. Please try again.');
    }
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
