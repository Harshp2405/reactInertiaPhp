<?php

namespace App\Http\Controllers;

use App\Events\ReportCreated;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ReportController extends Controller
{
    public function create()
    {
        return Inertia::render('Reports/Create');
    }

    // Store report
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'nullable|string|max:255',
            'message' => 'required|string|max:1000',
        ]);

        $report = Report::create([
            'user_id' => $request->user()->id,
            'type' => $request->type ?? 'other',
            'message' => $request->message,
        ]);

        broadcast(new ReportCreated($report));

        return redirect()->route('report.create')->with('success', 'Report submitted successfully!');
    }

    // Optional: List reports (for admin/accountant)
    public function index(Request $request)
    {
        $query = Report::with('user');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $reports = $query->latest()->paginate(10)->withQueryString();
        $users = User::select('id', 'name')->get();

        return Inertia::render('admin/Reports/Index', [
            'reports' => $reports,
            'users' => $users,
            'filters' => $request->only('type', 'user_id'),
        ]);
    }

   public function resolve(Request $request, Report $report)
{
    $request->validate([
        'status' => 'required|string|in:resolved,processing,onProcess,pending,open',
    ]);

    $report->update(['status' => $request->status]);

    return redirect()->back()->with('success', 'Report marked as resolved!');
}

}
