@extends('layouts.admin')

@section('title')
    Store Settings
@endsection

@section('content')
    <!-- Section Content -->
    <div class="section-content section-dashboard-home pb-3" data-aos="fade-up">
        <div class="container-fluid">
            <div class="dashboard-heading">
                <h2 class="dashboard-title">Product
                </h2>
                <p class="dashboard-subtitle">
                    Edit {{ $item->name }}
                </p>
            </div>
            <form action="{{ route('admin.product.update', $item->id) }}" method="post" enctype="multipart/form-data">
                <div class="dashboard-content">
                    <div class="row">
                        <div class="col-md-7 mb-3">
                            <div class="row">
                                <div class="col-md-12">
                                    @if ($errors->any())
                                        <div class="alert alert-danger">
                                            <ul>
                                                @foreach ($errors->all() as $error)
                                                    <li>{{ $error }}</li>
                                                @endforeach
                                            </ul>
                                        </div>
                                    @endif
                                    @method('PUT')
                                    @csrf
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="h4 py-2">
                                                Basic
                                            </h4>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>Name</label>
                                                        <input value="{{ $item->name }}" type="text"
                                                            class="form-control" name="name" required />
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>Seller</label>
                                                        <select name="user_id" class="form-control">
                                                            @foreach ($users as $user)
                                                                <option value="{{ $user->id }}">{{ $user->name }}
                                                                </option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label>Category</label>
                                                        <select name="category_id" class="form-control">
                                                            {{-- Foreach Category and Selected If Select --}}
                                                            @foreach ($categories as $category)
                                                                <option value="{{ $category->id }}"
                                                                    {{ $category->id == $item->category_id ? 'selected' : '' }}>
                                                                    {{ $category->name }}</option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label>Price</label>
                                                        <input value="{{ $item->price }}"
                                                            type="number"class="form-control" name="price" required />
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label>Stock</label>
                                                        <input type="number" value="{{ $item->stock }}"
                                                            class="form-control" name="stock" required />
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label>Minimum Order</label>
                                                        <input type="number" value="{{ $item->min_order }}"
                                                            class="form-control" name="min_order" required />
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>Description</label>
                                                        <textarea name="description" id="editor">
                                                            {{ $item->description }}
                                                        </textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            {{-- Weight --}}
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label>Weight</label>
                                                        <input type="number" value="{{ $item->details->weight }}"
                                                            class="form-control" name="weight" />
                                                    </div>
                                                </div>
                                                {{-- Weight Unit --}}
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label>Weight Unit</label>
                                                        <select name="weight_unit" class="form-control">
                                                            <option value="gram"
                                                                {{ $item->details->weight_unit == 'gram' ? 'selected' : '' }}>
                                                                gram</option>
                                                            <option value="kg"
                                                                {{ $item->details->weight_unit == 'kg' ? 'selected' : '' }}>
                                                                kg</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        {{-- Status : DRAFT, PUBLISHED, UNPUBLISHED, BLOCK --}}
                                                        <label>Status</label>
                                                        <select name="status" class="form-control">
                                                            <option value="draft"
                                                                {{ $item->status == 'draft' ? 'selected' : '' }}>
                                                                DRAFT</option>
                                                            <option value="published"
                                                                {{ $item->status == 'published' ? 'selected' : '' }}>
                                                                PUBLISHED</option>
                                                            <option value="unpublished"
                                                                {{ $item->status == 'unpublished' ? 'selected' : '' }}>
                                                                UNPUBLISHED</option>
                                                            <option value="block"
                                                                {{ $item->status == 'block' ? 'selected' : '' }}>
                                                                BLOCK</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 mt-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="h4 py-2">
                                                Pre Order
                                            </h4>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>Status</label>
                                                        <div class="custom-control custom-switch">
                                                            <input name="pre_order" value="{{ $item->details->pre_order }}"
                                                                type="checkbox" class="custom-control-input"
                                                                id="switchPreOrder">
                                                            <label class="custom-control-label"
                                                                for="switchPreOrder">Off</label>
                                                        </div>
                                                    </div>
                                                    {{-- <div class="col-md-12" id="preOrderMessage"> --}}
                                                    <div class="form-group" id="pre_order_message">
                                                        <label>Pre Order Message</label>
                                                        <textarea name="pre_order_message" id="editor2">{{ $item->details->pre_order_message }}</textarea>
                                                    </div>
                                                    {{-- </div> --}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="h4 py-2">
                                                Images
                                            </h4>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    {{-- Thumbnail --}}
                                                    <label for="">Thumbnail</label>
                                                    <div class="col-md-12 mb-3">
                                                        {{-- Thumbnail Preview --}}
                                                        <div id="thumbnail-preview">
                                                            <img id="preview-image"
                                                                src="{{ asset('storage/' . $item->thumbnail) }}"
                                                                class="img-fluid" alt="Preview Image" />
                                                        </div>
                                                    </div>
                                                    <div class="form-group">
                                                        <a id="button-upload" class="form-control btn">Upload
                                                            Thumbnail</a>
                                                        <input type="file" style="display: none;" id="photo-file"
                                                            name="thumbnail" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="card mt-3">
                                        <div class="card-body">
                                            <h4 class="h4 py-2">
                                                Discount
                                            </h4>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>Status</label>
                                                        <div class="custom-control custom-switch">
                                                            <input name="discount_status"
                                                                value="{{ $item->details->discount_status }}"
                                                                type="checkbox" class="custom-control-input"
                                                                id="switchDiscount">
                                                            <label class="custom-control-label"
                                                                for="switchDiscount">Off</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {{-- Discount Select --}}
                                            <div class="row" id="discount_row">
                                                {{-- Pre Order Message --}}
                                                <div class="col-md-12" id="discountType">
                                                    <div class="form-group">
                                                        <label>Discount Type</label>
                                                        {{-- Selected From Value --}}
                                                        <select name="discount_type" id="discount_type"
                                                            class="form-control">
                                                            {{-- If Discount Type = Percentage --}}
                                                            <option value="percent"
                                                                {{ $item->details->discount_type == 'percent' ? 'selected' : '' }}>
                                                                Percentage</option>
                                                            {{-- If Discount Type = Fixed --}}
                                                            <option value="fixed"
                                                                {{ $item->details->discount_type == 'fixed' ? 'selected' : '' }}>
                                                                Fixed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {{-- Discount Start Date --}}
                                                <div class="col-md-6" id="discountStartDate">
                                                    <div class="form-group">
                                                        <label>Discount Start Date</label>
                                                        <input type="date"
                                                            value="{{ $item->details->discount_start_date }}"
                                                            class="form-control" name="discount_start_date" />
                                                    </div>
                                                </div>
                                                {{-- Discount End Date --}}
                                                <div class="col-md-6" id="discountEndDate">
                                                    <div class="form-group">
                                                        <label>Discount End Date</label>
                                                        <input type="date"
                                                            value="{{ $item->details->discount_end_date }}"
                                                            class="form-control" name="discount_end_date" />
                                                    </div>
                                                </div>
                                                {{-- Discount Value --}}
                                                <div class="col-md-6" id="discountValue">
                                                    <div class="form-group">
                                                        <label>Discount Value</label>
                                                        {{-- <input type="number" max="100" class="form-control" name="discount_value" /> --}}
                                                        <div class="input-group mb-3">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text"
                                                                    id="discount_type_label">%</span>
                                                            </div>
                                                            <input type="number" class="form-control"
                                                                name="discount_value"
                                                                @php
if ($item->details->discount_value != 0 || $item->details->discount_value != null) {
                                                                        echo 'value="' . $item->details->discount_value . '"';
                                                                    }else {
                                                                        echo 'value="0"';
                                                                    } @endphp
                                                                aria-describedby="basic-addon1">
                                                        </div>
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
                                                            <input type="number" class="form-control"
                                                                name="discount_price" disabled aria-label="Username"
                                                                aria-describedby="basic-addon1">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12 mt-3">
                            <div class="card">
                                <div class="card-body">
                                    <h4 class="h4 py-2">
                                        Galleries
                                    </h4>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label for="">Photos</label>
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="row">
                                                        @if ($galleries->count() > 0)
                                                            @foreach ($galleries as $items)
                                                                <div class="col-md-3 mb-3">
                                                                    <div id="thumbnail-preview{{ $loop->iteration }}">
                                                                        <div class="gallery-container">
                                                                            <img id="preview-image{{ $loop->iteration }}"
                                                                                src="{{ asset('storage/' . $items->image) }}"
                                                                                class="w-100" alt="Preview Image" />
                                                                            <a href="{{ route('admin.product.gallery.delete', $items->id) }}"
                                                                                class="delete-gallery">
                                                                                <img src="/images/icon-delete.svg"
                                                                                    alt="" />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            @endforeach
                                                        @else
                                                            <div class="col-md-4 mb-3">
                                                                <div id="thumbnail-preview">
                                                                    <img id="preview-image"
                                                                        src="{{ asset('images/thumbnail-upload.png') }}"
                                                                        class="img-fluid" alt="Preview Image" />
                                                                </div>
                                                            </div>
                                                        @endif
                                                    </div>
                                                    <input type="file" style="display: none;" id="photo-thumbnail"
                                                        name="photo" class="form-control" />
                                                    {{-- Button Add Photo --}}
                                                    <div data-id="{{ $item->id }}" id="add-photo-btn"
                                                        class="btn btn-primary btn-block">Add
                                                        Photo</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12 col-md-12">
                            <div class="row">
                                <div class="col text-right">
                                    <button type="submit" class="btn btn-success btn-block px-5">
                                        Save Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
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

        // Set price to number only
        $('input[name="price"]').on('input', function() {});
    </script>

    {{-- Script for discount --}}
    <script>
        // Update for Discount

        // Get value from discount_status
        var discount_status = $('input[name="discount_status"]').val();

        // If discount_status value is on, show discount_row
        // If discount_status value is off, hide discount_row
        if (discount_status == 'on') {
            $('#discount_row').show();
            $('#switchDiscount').next().text('On');
            // Checked
            $('#switchDiscount').prop('checked', true);
        } else {
            $('#discount_row').hide();
            // Change label to Off
            $('#switchDiscount').next().text('Off');
            // Unchecked
            $('#switchDiscount').prop('checked', false);
        }

        // Discount status change event.
        // If discount status is on, show discount_row
        // If discount status is off, hide discount_row
        $('#switchDiscount').on('change', function() {
            if ($(this).is(':checked')) {
                // Change label to On
                $(this).next().text('On');
                $('#discount_row').show();
            } else {
                // Change label to Off
                $(this).next().text('Off');
                $('#discount_row').hide();
            }
        });

        // Get value from discount_type
        var discount_type = $('select[name="discount_type"]').val();

        // If discount type is percent, set discount_type_label to % and discount_value max to 100
        // If discount type is fixed, set discount_type_label to Rp. and discount_value max to 999999999
        if (discount_type == 'percent') {
            $('#discount_type_label').text('%');
            $('input[name="discount_value"]').attr('max', 100);
        } else {
            $('#discount_type_label').text('Rp');
            $('input[name="discount_value"]').attr('max', 999999999);
        }

        // Discount type change event.
        // If discount type is percent, set discount_type_label to % and discount_value max to 100
        // If discount type is fixed, set discount_type_label to Rp. and discount_value max to 999999999
        $('select[name="discount_type"]').on('change', function() {
            if ($(this).val() == 'percent') {
                $('#discount_type_label').text('%');
                $('input[name="discount_value"]').attr('max', 100);
            } else {
                $('#discount_type_label').text('Rp');
                $('input[name="discount_value"]').attr('max', 999999999);
            }
        });

        // Set discount_price value after discount_value change
        // Set discount_price value after discount_value change
        $('input[name="discount_value"]').on('input', function() {
            var discount_type = $('select[name="discount_type"]').val();
            var discount_value = $(this).val();
            var price = $('input[name="price"]').val();
            var discount_price = 0;

            if (discount_value === '' || parseFloat(discount_value) === 0) {
                discount_price = price;
            } else {
                if (discount_type === 'percent') {
                    discount_price = price - (price * (discount_value / 100));
                } else {
                    discount_price = price - discount_value;
                }
            }

            // Check if discount_value is greater than price or exceeds 100% for percentage discount
            if ((parseFloat(discount_value) > parseFloat(price) && discount_type === 'fixed') || (parseFloat(
                    discount_value) > 100 && discount_type === 'percent')) {
                alert('Error: Invalid discount value.');
                $(this).val(0);
                $('input[name="discount_price"]').val('');
            } else {
                $('input[name="discount_price"]').val(discount_price);
            }
        });

        $('#save').on('click', function() {
            var discount_value = $('input[name="discount_value"]').val();

            if (discount_value === "" || parseFloat(discount_value) === 0) {
                alert('Discount value cannot be empty or 0.');
                return;
            }

            // Lanjutkan dengan pengiriman data ke server melalui Ajax
            // ...
        });

        // If discount value is empty, set discount_price to 0
        $('input[name="discount_value"]').on('change', function() {
            if ($(this).val() == '') {
                $('input[name="discount_price"]').val(0);
            }
        });
    </script>

    <script>
        // Update for preorder
        // If preorder status value is checked, show pre_order_message
        // If preorder status value is not checked, hide pre_order_messag

        $('input[name="pre_order"]').val();

        // Jika pre_order value = on, maka tampilkan pre_order_message
        if ($('input[name="pre_order"]').val() == 'on') {
            $('#switchPreOrder').prop('checked', true);
            $('#switchPreOrder').next().text('On');
            $('#pre_order_message').show();
        } else {
            $('#switchPreOrder').prop('checked', false);
            $('#switchPreOrder').next().text('Off');
            $('#pre_order_message').hide();
        }

        $('#switchPreOrder').on('change', function() {
            if ($(this).is(':checked')) {
                // Change label to On
                $(this).next().text('On');
                $('input[name="pre_order"]').val('on');
                $('#pre_order_message').show();
            } else {
                // Change label to Off
                $(this).next().text('Off');
                $('input[name="pre_order"]').val('off');
                $('#pre_order_message').hide();
            }
        });
    </script>

    <script>
        $(document).ready(function() {
            // Menambahkan event listener pada tombol "Add Photo"
            $('#add-photo-btn').on('click', function() {
                // Membuka dialog pilih file saat tombol diklik
                $('#photo-thumbnail').click();
            });

            // Menangani peristiwa pemilihan file
            $('#photo-thumbnail').on('change', function() {
                var file = $(this)[0].files[0];
                var formData = new FormData();
                formData.append('photo', file);

                // Mengirimkan permintaan Ajax ke endpoint Laravel untuk mengunggah gambar
                $.ajax({
                    // url: '/upload', //route
                    url: "{{ route('admin.product.gallery.upload', ['id' => $item->id]) }}",
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('enctype', 'multipart/form-data');
                        var csrfToken = $('meta[name="csrf-token"]').attr('content');
                        xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
                    },
                    // Jika pengunggahan berhasil
                    success: function(response) {
                        // Jika pengunggahan berhasil, tambahkan gambar baru ke tampilan
                        location.reload();
                    },
                    error: function(xhr) {
                        // Menampilkan pesan kesalahan jika ada masalah dengan pengunggahan gambar
                        alert('Error uploading image. Please try again.');
                        console.log(xhr);
                    }
                });
            });
        });
    </script>
@endpush
