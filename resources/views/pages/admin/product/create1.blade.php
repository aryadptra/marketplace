@extends('layouts.admin')

@section('title')
    Store Settings
@endsection

@section('content')
    <div class="section-content section-dashboard-home pb-3 " data-aos="fade-up">
        <div class="container-fluid">
            <div class="dashboard-heading">
                <h2 class="dashboard-title">Product</h2>
                <p class="dashboard-subtitle">
                    Create New Product
                </p>
            </div>
            <div class="dashboard-content">
                <div class="row">
                    <div class="col-12">
                        @if ($errors->any())
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif
                        <form action="{{ route('admin.product.store') }}" method="post" enctype="multipart/form-data">
                            @csrf
                            <div class="card">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label>Name</label>
                                                    <input type="text" class="form-control" name="name" required />
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label>Seller</label>
                                                    <select name="user_id" class="form-control">
                                                        @foreach ($users as $user)
                                                            <option value="{{ $user->id }}">{{ $user->name }}</option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Category</label>
                                                    <select name="category_id" class="form-control">
                                                        @foreach ($categories as $categories)
                                                            <option value="{{ $categories->id }}">{{ $categories->name }}
                                                            </option>
                                                        @endforeach
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Price</label>
                                                    <div class="input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text" id="basic-addon1">Rp</span>
                                                        </div>
                                                        <input type="number" class="form-control" name="price"
                                                            aria-label="Username" aria-describedby="basic-addon1">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Stock</label>
                                                    <input type="number" class="form-control" name="stock" required />
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Minimum Order</label>
                                                    <input type="number" class="form-control" name="min_order" required />
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label>Description</label>
                                                    <textarea name="description" id="editor"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        {{-- Pre Order Select --}}
                                        <div class="row">
                                            <div class="col-md-2">
                                                <div class="form-group">
                                                    <label>Pre Order</label>
                                                    <select name="pre_order" class="form-control">
                                                        <option value="off">No</option>
                                                        <option value="on">Yes</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="form-group">
                                                    <label>Discount</label>
                                                    {{-- Input number --}}
                                                    <select name="discount" class="form-control">
                                                        <option value="off">No</option>
                                                        <option value="on">Yes</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            {{-- Pre Order Message --}}
                                            <div class="col-md-12" id="preOrderMessage">
                                                <div class="form-group">
                                                    <label>Pre Order Message</label>
                                                    <textarea name="pre_order_message" id="editor2"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        {{-- Discount Select --}}
                                        <div class="row" id="discount_row" hidden>
                                            {{-- Pre Order Message --}}
                                            <div class="col-md-12" id="discountType">
                                                <div class="form-group">
                                                    <label>Discount Type</label>
                                                    <select name="discount_type" class="form-control">
                                                        <option value="percent">Percent</option>
                                                        <option value="fixed">Fixed</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {{-- Discount Start Date --}}
                                            <div class="col-md-6" id="discountStartDate">
                                                <div class="form-group">
                                                    <label>Discount Start Date</label>
                                                    <input type="date" class="form-control" name="discount_start_date" />
                                                </div>
                                            </div>
                                            {{-- Discount End Date --}}
                                            <div class="col-md-6" id="discountEndDate">
                                                <div class="form-group">
                                                    <label>Discount End Date</label>
                                                    <input type="date" class="form-control" name="discount_end_date" />
                                                </div>
                                            </div>
                                            {{-- Discount Value --}}
                                            <div class="col-md-6" id="discountValue">
                                                <div class="form-group">
                                                    <label>Discount Value</label>
                                                    <input type="number" max="100" class="form-control"
                                                        name="discount_value" />
                                                </div>
                                            </div>
                                            {{-- Price After Discount --}}
                                            <div class="col-md-6" id="discountPrice">
                                                <div class="form-group">
                                                    <label>Price After Discount</label>
                                                    <div class="input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text" id="basic-addon1">Rp</span>
                                                        </div>
                                                        <input type="number" class="form-control" name="discount_price"
                                                            disabled aria-label="Username"
                                                            aria-describedby="basic-addon1">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {{-- Weight --}}
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Weight</label>
                                                    <input type="number" class="form-control" name="weight" />
                                                </div>
                                            </div>
                                            {{-- Weight Unit --}}
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Weight Unit</label>
                                                    <select name="weight_unit" class="form-control">
                                                        <option value="gram">Gram</option>
                                                        <option value="kg">Kilogram</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                {{-- Thumbnail --}}
                                                <div class="form-group">
                                                    <label for="">Thumbnail</label>
                                                    <a id="button-upload" class="form-control btn">Upload Thumbnail</a>
                                                    <input type="file" style="display: none;" id="photo-file"
                                                        name="thumbnail" class="form-control" />
                                                    <p class="text-muted">
                                                        Select one file
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="col-md-4 mb-3">
                                                {{-- Thumbnail Preview --}}
                                                <div id="thumbnail-preview">
                                                    <img id="preview-image"
                                                        src="{{ asset('images/thumbnail-upload.png') }}"
                                                        alt="Preview Image" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    {{-- Status : DRAFT, PUBLISHED, UNPUBLISHED, BLOCK --}}
                                                    <label>Status</label>
                                                    <select name="status" class="form-control">
                                                        <option value="draft">Draft</option>
                                                        <option value="published">Published</option>
                                                        <option value="unpublished">Unpublished</option>
                                                        <option value="block">Block</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col text-right">
                                                <button type="submit" class="btn btn-success px-5">
                                                    Save Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('addon-script')
    <script src="https://cdn.ckeditor.com/4.14.0/standard/ckeditor.js"></script>

    <script>
        CKEDITOR.replace('editor');
    </script>

    <script>
        CKEDITOR.replace('editor2');
    </script>

    <script>
        $('#button-upload').on('click', function() {
            $('#photo-file').trigger('click');
        });

        $(document).ready(function() {
            $('#photo-file').on('change', function() {
                var input = $(this)[0];
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $('#preview-image').attr('src', e.target.result);
                        $('#preview-image').show();
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            });
        });


        $('#preOrderMessage').hide();
        // Show Pre Order Message If Pre Order is On And Set Value Pre Order Message to NULL

        $('select[name="pre_order"]').on('change', function() {
            if ($(this).val() == 'on') {
                $('#preOrderMessage').show();
                $('textarea[name="pre_order_message"]').val('');
            } else {
                $('#preOrderMessage').hide();
                $('textarea[name="pre_order_message"]').val('');
            }
        });

        // Set price to number only
        $('input[name="price"]').on('input', function() {});



        // $('input[name="price"]').on('input', function() {
        //     let price = $(this).val().replace(/[^\d]/g, '');
        //     let length = price.length;
        //     let price_formatted = "";

        //     if (length > 3) {
        //         let last_three_digits = price.substring(length - 3, length);
        //         let remaining_digits = price.substring(0, length - 3);
        //         price_formatted = remaining_digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "." + last_three_digits;
        //     } else {
        //         price_formatted = price;
        //     }

        //     $(this).val(price_formatted);
        // });

        // $('select[name="discount"]').on('change', function() {
        //     if ($(this).val() == 'off') {
        //         $('#discount_row').attr('hidden', true);
        //     } else {
        //         $('#discount_row').removeAttr('hidden');
        //     }
        // });

        // $('select[name="discount"]').on('change', function() {
        //     let discount = $(this).val();
        //     let price = $('input[name="price"]').val();
        //     let discount_type = $('select[name="discount_type"]').val();

        //     $('input[name="discount_price"]').val(price);

        //     if (discount_type == 'percent') {
        //         $('input[name="discount_value"]').attr('max', 100);

        //         $('input[name="discount_value"]').on('keyup', function() {
        //             let discount_value = $(this).val();
        //             let discount_price = price - (price * (discount_value / 100));
        //             // discount price to rupiah format
        //             discount_price = discount_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        //             $('input[name="discount_price"]').val(discount_price);
        //         });

        //     }

        //     $('select[name="discount_type"]').on('change', function() {
        //         let discount_type = $(this).val();
        //         let discount_value = $('input[name="discount_value"]').val();

        //         if (discount_type == 'percent') {
        //             $('input[name="discount_value"]').attr('max', 100);

        //             $('input[name="discount_value"]').on('keyup', function() {
        //                 let discount_value = $(this).val();
        //                 let discount_price = price - (price * (discount_value / 100));
        //                 discount_price = discount_price.toString().replace(
        //                     /\B(?=(\d{3})+(?!\d))/g,
        //                     ".");
        //                 $('input[name="discount_price"]').val(discount_price);
        //             });

        //         } else {
        //             $('input[name="discount_value"]').removeAttr('max');

        //             $('input[name="discount_value"]').on('keyup', function() {
        //                 let discount_value = $(this).val();
        //                 let discount_price = price - discount_value;
        //                 discount_price = discount_price.toString().replace(
        //                     /\B(?=(\d{3})+(?!\d))/g,
        //                     ".");
        //                 $('input[name="discount_price"]').val(discount_price);
        //             });
        //         }
        //     });

        //     if (discount == 'off') {
        //         $('input[name="discount_price"]').val(0);
        //     }
        // });
    </script>
@endpush
