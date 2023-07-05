<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetails;
use App\Models\ProductGallery;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Str;
use RealRashid\SweetAlert\Facades\Alert;

class ProductController extends Controller
{
    public function index()
    {
        if (request()->ajax()) {
            $query = Product::with(['user', 'category']);

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
                                    <a class="dropdown-item" href="' . route('admin.product.edit', $item->id) . '">
                                        Edit
                                    </a>
                                    <form action="' . route('admin.product.destroy', $item->id) . '" method="POST">
                                        ' . method_field('delete') . csrf_field() . '
                                        <button type="submit" class="dropdown-item text-danger">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                    </div>';
                })->editColumn('thumbnail', function ($item) {
                    return $item->thumbnail ?  '<img src="' . Storage::url($item->thumbnail) . '" style="max-height: 100px;">' : '';
                })
                ->rawColumns(['action', 'thumbnail'])
                ->make();
        }

        return view('pages.admin.product.index');
    }

    public function create()
    {
        $users = User::all();
        // Parent Category
        $categories = Category::where('parent_id', 0)->get();

        // Child Category
        $childCategories = Category::where('parent_id', '!=', 0)->get();

        return view('pages.admin.product.create', [
            'users' => $users,
            'categories' => $categories,
            'childCategories' => $childCategories
        ]);
    }

    public function store(Request $request)
    {
        $data['user_id'] = Auth::user()->id;

        // Product table
        $data['category_id'] = $request->category_id;
        $data['name'] = $request->name;
        $data['description'] = $request->description;
        $data['price'] = $request->price;
        $data['stock'] = $request->stock;
        $data['min_order'] = $request->min_order;
        $data['status'] = $request->status;
        $slug_name = Str::slug($request->name);
        $slug_seller = Str::slug(Auth::user()->name);
        $data['slug'] = $slug_name . '-' . $slug_seller;

        // Validate Thumbnail
        $this->validate($request, [
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('assets/products/thumbnails', 'public');
        }


        $createProduct = Product::create($data);

        if ($createProduct) {
            // Get Product ID
            $product = Product::where('slug', $data['slug'])->first();

            $data['product_id'] = $product->id;
            $data['pre_order'] = $request->pre_order ? 'on' : 'off';
            $data['pre_order_message'] = $request->pre_order_message;
            $data['weight'] = $request->weight;
            $data['weight_unit'] = $request->weight_unit;
            $data['discount_status'] = $request->discount_status ? 'on' : 'off';
            $data['discount_type'] = $request->discount_status == 'on' ? $request->discount_type : null;
            $data['discount_start_date'] = $request->discount_start_date;
            $data['discount_end_date'] = $request->discount_end_date;
            $data['discount_percentage'] = $request->discount_percentage;
            $data['discount_value'] = $request->discount_value;
            $data['discount_minimum_quantity'] = $request->discount_minimum_quantity;
            $data['discount_maximum_quantity'] = $request->discount_maximum_quantity;

            ProductDetails::create($data);
        }

        Alert::success('Success', $request->name . ' Successfully Added!');

        return redirect()->route('admin.product.index');
    }

    // Edit
    public function edit($id)
    {
        $item = Product::findOrFail($id);

        $users = User::all();

        // Parent Category
        $categories = Category::where('parent_id', 0)->get();

        // Child Category
        $childCategories = Category::where('parent_id', '!=', 0)->get();

        // Gallery
        $galleries = ProductGallery::where('product_id', $id)->get();

        return view('pages.admin.product.edit', [
            'item' => $item,
            'users' => $users,
            'categories' => $categories,
            'childCategories' => $childCategories,
            'galleries' => $galleries
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * $id = Product ID
     * Method = PUT
     */
    public function update(Request $request, $id)
    {
        if (!$id) {
            Alert::error('Error', 'Product ID Not Found!');
            return redirect()->route('admin.product.index');
        }

        $data['user_id'] = Auth::user()->id;

        // Product table
        $data['category_id'] = $request->category_id;
        $data['name'] = $request->name;
        $data['description'] = $request->description;
        $data['price'] = $request->price;
        $data['stock'] = $request->stock;
        $data['min_order'] = $request->min_order;
        $data['status'] = $request->status;
        $slug_name = Str::slug($request->name);
        $slug_seller = Str::slug(Auth::user()->name);
        $data['slug'] = $slug_name . '-' . $slug_seller;

        // Validate Thumbnail
        // If Thumbnail is not empty
        if ($request->thumbnail) {
            $this->validate($request, [
                'thumbnail' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);

            if ($request->hasFile('thumbnail')) {
                $data['thumbnail'] = $request->file('thumbnail')->store('assets/products/thumbnails', 'public');
            }
        }

        $updateProduct = Product::where('id', $id)->update($data);

        if ($updateProduct) {
            // Get Product ID
            $product = Product::where('slug', $data['slug'])->first();

            // Jika ada gallery
            // Jika ada galeri
            if ($request->hasFile('photo')) {
                foreach ($request->file('photo') as $key => $photo) {
                    $photoName = $photo->getClientOriginalName();
                    $photo->storeAs('assets/products/gallery', $photoName, 'public');

                    $dataGallery['product_id'] = $product->id;
                    $dataGallery['image'] = $photoName;

                    ProductGallery::create($dataGallery);
                }
            }

            $dataDetail['product_id'] = $product->id;
            $dataDetail['pre_order'] = $request->pre_order ? 'on' : 'off';
            $dataDetail['pre_order_message'] = $request->pre_order_message;
            $dataDetail['weight'] = $request->weight;
            $dataDetail['weight_unit'] = $request->weight_unit;
            $dataDetail['discount_status'] = $request->discount_status ? 'on' : 'off';
            $dataDetail['discount_type'] = $request->discount_status == 'on' ? $request->discount_type : null;
            $dataDetail['discount_start_date'] = $request->discount_start_date;
            $dataDetail['discount_end_date'] = $request->discount_end_date;
            $dataDetail['discount_percentage'] = $request->discount_percentage;
            $dataDetail['discount_value'] = $request->discount_value;
            $dataDetail['discount_minimum_quantity'] = $request->discount_minimum_quantity;
            $dataDetail['discount_maximum_quantity'] = $request->discount_maximum_quantity;

            ProductDetails::where('product_id', $id)->update($dataDetail);
        }

        Alert::success('Success', $request->name . ' Successfully Updated!');

        return redirect()->route('admin.product.index');
    }
}
