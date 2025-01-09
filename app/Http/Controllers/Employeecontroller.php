<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Employee;
use Illuminate\Http\Request;


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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
