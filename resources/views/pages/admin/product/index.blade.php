@extends('layouts.admin')

@section('title')
    Store Dashboard
@endsection

@section('content')
    <!-- Section Content -->
    <div class="section-content section-dashboard-home" data-aos="fade-up">
        <div class="container-fluid">
            <div class="dashboard-heading">
                <h2 class="dashboard-title">Product</h2>
                <p class="dashboard-subtitle">
                    List of Product
                </p>
            </div>
            <div class="dashboard-content">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-body">
                                <a href="{{ route('admin.product.create') }}" class="btn btn-primary mb-3">
                                    + Add New Product
                                </a>
                                <div class="table-responsive">
                                    <table class="table table-hover scroll-horizontal-vertical w-100" id="crudTable">
                                        <thead>
                                            <tr>
                                                <th>Thumbnail</th>
                                                <th>Name</th>
                                                <th>Seller</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Stok</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection


@push('addon-script')
    <script>
        // AJAX DataTable
        var datatable = $('#crudTable').DataTable({
            processing: true,
            serverSide: true,
            ordering: true,
            ajax: {
                url: '{!! url()->current() !!}',
            },
            columns: [{
                    data: 'thumbnail',
                    name: 'thumbnail'
                },
                {
                    data: 'name',
                    name: 'name'
                },
                {
                    // Name of relationship method in Product Model
                    data: 'user.name',
                    name: 'user.name'
                },
                {
                    data: 'category.name',
                    name: 'category.name'
                },
                {
                    data: 'price',
                    name: 'price'
                },
                {
                    data: 'stock',
                    name: 'stock'
                },
                {
                    data: 'action',
                    name: 'action',
                    orderable: false,
                    searcable: false,
                    width: '15%'
                },
            ]
        });
    </script>
@endpush
