<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Str;
use RealRashid\SweetAlert\Facades\Alert;


class CategoryController extends Controller
{
    public function index()
    {

        if (request()->ajax()) {
            $query = Category::query();

            return DataTables::of($query)
                ->addColumn('action', function ($item) {
                    return '
                        <div class="btn-group">
                            <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle mr-1 mb-1"
                                    type="button" id="action' .  $item->id . '"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        Action
                                </button>
                                <div class="dropdown-menu" aria-labelledby="action' .  $item->id . '">
                                    <a class="dropdown-item" href="' . route('admin.category.edit', $item->id) . '">
                                        Edit
                                    </a>
                                    <a href="' . route('admin.category.destroy', $item->id) . '" class="dropdown-item btn" data-confirm-delete="true">Delete</a>
                                </div>
                            </div>
                        </div>
                        ';
                })
                ->editColumn('icon', function ($item) {
                    return $item->icon ?  '<img src="' . Storage::url($item->icon) . '" style="max-height: 40px;">' : '';
                })
                ->rawColumns(['action', 'icon'])
                ->make();
        }


        $title = 'Delete Category';
        $text = "Are you sure you want to delete?";
        confirmDelete($title, $text);

        return view('pages.admin.category.index');
    }

    public function create(Request $request)
    {
        // Where Parent Id > 0
        // $categories = Category::where('parent_id', '=', 0)->get();

        return view('pages.admin.category.create', [
            // 'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        if ($request->parent_id) {
            $data['parent_id'] = $request->parent_id;
        } else {
            $data['parent_id'] = 0;
        }

        $data['level'] = 0;
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')->store('assets/category', 'public');
        }

        Category::create($data);

        Alert::success('Success', $request->name . ' Successfully Added!');

        return redirect()->route('admin.category.index');
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        $item = Category::findOrFail($id);

        return view('pages.admin.category.edit', [
            'item' => $item,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Update Category
        $data = $request->all();

        $item = Category::findOrFail($id);

        $nameDefault = $item->name;

        if ($request->parent_id) {
            $data['parent_id'] = $request->parent_id;
        } else {
            $data['parent_id'] = 0;
        }

        $data['name'] = $request->name;
        $data['slug'] = Str::slug($request->name);

        if ($request->hasFile('icon')) {
            Storage::delete($item->icon);
            $data['icon'] = $request->file('icon')->store('assets/category', 'public');
        }

        $item->update($data);

        Alert::success('Success', $nameDefault . ' Successfully Changed to ' . $request->name . '!');

        return redirect()->route('admin.category.index');
    }

    public function destroy($id)
    {
        // Delete Category
        $item = Category::findOrFail($id);
        $item->forceDelete();

        Alert::success('Success', $item->name . ' Successfully Deleted!');

        return redirect()->route('admin.category.index');
    }

    public function search(Request $request)
    {
        $data = [];

        if ($request->filled('q')) {
            $data = Category::select("name", "id")
                ->where('name', 'LIKE', '%' . $request->get('q') . '%')
                ->get();
        } else {
            // Order by Name
            $data = Category::select("name", "id")
                ->orderBy('name', 'asc')
                ->get();
        }


        return response()->json($data);
    }
}
