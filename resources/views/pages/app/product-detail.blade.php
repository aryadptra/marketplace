@extends('layouts.app')

@push('add-content')
    <section class="page-title bg-white">
        <div class="container">
            <div class="page-title-row">
                <div class="page-title-content">
                    <h1>{{ $detail->name }}</h1>
                </div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        {{-- <li class="breadcrumb-item"><a href="#">Home</a></li> --}}
                        <li class="breadcrumb-item"><a href="#">Produk</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{{ $detail->name }}</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
@endpush

@section('content')
    <div class="content bg-white">
        <div class="content-wrap">
            <div class="container">
                <div class="single-product">
                    <div class="product">
                        <div class="row gutter-40">
                            <div class="col-md-6">
                                <div class="product-image">
                                    <div class="fslider" data-pagi="false" data-arrows="false" data-thumbs="true">
                                        <div class="flexslider">
                                            <div class="slider-wrap" data-lightbox="gallery">
                                                <div class="slide" data-thumb="{{ Storage::url($detail->thumbnail) }}"><a
                                                        href="{{ Storage::url($detail->thumbnail) }}"
                                                        title="Pink Printed Dress - Front View"
                                                        data-lightbox="gallery-item"><img
                                                            src="{{ Storage::url($detail->thumbnail) }}"
                                                            alt="Pink Printed Dress"></a></div>
                                                @foreach ($galleries as $item)
                                                    <div class="slide" data-thumb="{{ Storage::url($item->image) }}"><a
                                                            href="{{ Storage::url($item->image) }}"
                                                            title="Pink Printed Dress - Front View"
                                                            data-lightbox="gallery-item"><img
                                                                src="{{ Storage::url($item->image) }}"
                                                                alt="Pink Printed Dress"></a></div>
                                                @endforeach
                                            </div>
                                        </div>
                                    </div>
                                    <div class="sale-flash badge bg-danger p-2">Sale!</div>
                                </div><!-- Product Single - Gallery End -->
                            </div>
                            <div class="col-md-6 product-desc">
                                <div class="d-flex align-items-center justify-content-between">
                                    {{-- <div class="product-price"><del>$39.99</del> <ins>$24.99</ins></div> --}}
                                    <div class="product-price">Rp. {{ number_format($detail->price, 0, ',', '.') }}</div>
                                    <div class="d-flex align-items-center">
                                        <div class="product-rating">
                                            <i class="bi-star-fill"></i>
                                            <i class="bi-star-fill"></i>
                                            <i class="bi-star-fill"></i>
                                            <i class="bi-star-half"></i>
                                            <i class="bi-star"></i>
                                        </div>
                                        <button type="button" class="btn btn-sm btn-secondary ms-3"><i
                                                class="bi-heart-fill"></i></button>
                                    </div>
                                </div>
                                <div class="line"></div>
                                <form action="{{ route('cart-add', $detail->id) }}"
                                    class="cart mb-0 d-flex justify-content-between align-items-center" method="post"
                                    enctype='multipart/form-data'>
                                    @csrf
                                    <div class="quantity">
                                        <input type="button" value="-" class="minus">
                                        <input type="number" step="1" min="1" name="quantity" value="1"
                                            title="Qty" class="qty">
                                        <input type="button" value="+" class="plus">
                                    </div>
                                    <button type="submit" class="add-to-cart button m-0">Add to cart</button>
                                </form>
                                <div class="line"></div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <span class="text-muted">Category</span><span
                                            class="text-dark fw-semibold">{{ $detail->category->name }}</span>
                                    </li>

                                    <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <span class="text-muted">Weight</span><span
                                            class="text-dark fw-semibold">{{ $detail->details->weight }}
                                            {{ $detail->details->weight_unit }}</span>
                                    </li>
                                    <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <span class="text-muted">Quantity</span><span class="text-dark fw-semibold">
                                            {{ $detail->stock }} Pcs</span>
                                    </li>
                                </ul>
                                <div class="card mt-6 pt-4 border-0 border-top rounded-0 border-default">
                                    <div class="card-body p-0">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <h6 class="fs-6 fw-semibold mb-0">Share:</h6>
                                            <div class="d-flex">
                                                <a href="#"
                                                    class="social-icon si-small text-white border-transparent rounded-circle bg-facebook"
                                                    title="Facebook">
                                                    <i class="fa-brands fa-facebook-f"></i>
                                                    <i class="fa-brands fa-facebook-f"></i>
                                                </a>
                                                <a href="#"
                                                    class="social-icon si-small text-white border-transparent rounded-circle bg-twitter"
                                                    title="Twitter">
                                                    <i class="fa-brands fa-twitter"></i>
                                                    <i class="fa-brands fa-twitter"></i>
                                                </a>



                                                <a href="#"
                                                    class="social-icon si-small text-white border-transparent rounded-circle bg-pinterest"
                                                    title="Pinterest">

                                                    <i class="fa-brands fa-pinterest-p"></i>

                                                    <i class="fa-brands fa-pinterest-p"></i>

                                                </a>



                                                <a href="#"
                                                    class="social-icon si-small text-white border-transparent rounded-circle bg-whatsapp"
                                                    title="Whatsapp">

                                                    <i class="fa-brands fa-whatsapp"></i>

                                                    <i class="fa-brands fa-whatsapp"></i>

                                                </a>



                                                <a href="#"
                                                    class="social-icon si-small text-white border-transparent rounded-circle bg-rss"
                                                    title="RSS">

                                                    <i class="fa-solid fa-rss"></i>

                                                    <i class="fa-solid fa-rss"></i>

                                                </a>



                                                <a href="#"
                                                    class="social-icon si-small text-white border-transparent rounded-circle bg-email3 me-0"
                                                    title="Mail">

                                                    <i class="fa-solid fa-envelope"></i>

                                                    <i class="fa-solid fa-envelope"></i>

                                                </a>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div class="w-100"></div>
                            <div class="col-12 mt-5">
                                <div class="mb-0">
                                    <ul class="nav canvas-tabs tabs nav-tabs mb-3" id="tab-1" role="tablist"
                                        style="--bs-nav-link-font-weight: 500;">
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="canvas-tabs-1-tab" data-bs-toggle="pill"
                                                data-bs-target="#tabs-1" type="button" role="tab"
                                                aria-controls="canvas-tabs-1" aria-selected="true"><i
                                                    class="me-1 bi-justify"></i><span class="d-none d-md-inline-block">
                                                    Description
                                                </span>
                                                </a>
                                            </button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="canvas-tabs-3-tab" data-bs-toggle="pill"
                                                data-bs-target="#tabs-3" type="button" role="tab"
                                                aria-controls="canvas-tabs-3" aria-selected="false"><i
                                                    class="me-1 bi-star-fill"></i><span class="d-none d-md-inline-block">
                                                    Reviews (2)</span></a></button>
                                        </li>
                                    </ul>
                                    <div id="canvas-tab-alt-content" class="tab-content">
                                        <div class="tab-pane fade show active" id="tabs-1" role="tabpanel"
                                            aria-labelledby="canvas-tabs-1-tab" tabindex="0">
                                            {!! strip_tags($detail->description) !!}
                                        </div>
                                        <div class="tab-pane fade" id="tabs-3" role="tabpanel"
                                            aria-labelledby="canvas-tabs-3-tab" tabindex="0">
                                            <div id="reviews">
                                                <ol class="commentlist">
                                                    <li class="comment even thread-even depth-1" id="li-comment-1">
                                                        <div id="comment-1" class="comment-wrap">
                                                            <div class="comment-meta">
                                                                <div class="comment-author vcard">
                                                                    <span class="comment-avatar">
                                                                        <img alt='Image'
                                                                            src='https://0.gravatar.com/avatar/ad516503a11cd5ca435acc9bb6523536?s=60'
                                                                            height='60' width='60'>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div class="comment-content">
                                                                <div class="comment-author">John Doe<span><a
                                                                            href="#"
                                                                            title="Permalink to this comment">April 24,
                                                                            2021 at 10:46AM</a></span></div>
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                                    Quo perferendis aliquid tenetur. Aliquid, tempora, sit
                                                                    aliquam officiis nihil autem eum at repellendus facilis
                                                                    quaerat consequatur commodi laborum saepe non nemo nam
                                                                    maxime quis error tempore possimus est quasi
                                                                    reprehenderit fuga!</p>
                                                                <div class="review-comment-ratings">
                                                                    <i class="bi-star-fill"></i>
                                                                    <i class="bi-star-fill"></i>
                                                                    <i class="bi-star-fill"></i>
                                                                    <i class="bi-star-fill"></i>
                                                                    <i class="bi-star-half"></i>
                                                                </div>
                                                            </div>
                                                            <div class="clear"></div>
                                                        </div>
                                                    </li>
                                                </ol>
                                                <div class="text-end">
                                                    <a href="#" data-bs-toggle="modal"
                                                        data-bs-target="#reviewFormModal" class="button button-3d m-0">Add
                                                        a Review</a>
                                                </div>
                                                <div class="modal fade" id="reviewFormModal" tabindex="-1"
                                                    role="dialog" aria-labelledby="reviewFormModalLabel"
                                                    aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h4 class="modal-title" id="reviewFormModalLabel">Submit a
                                                                    Review</h4>
                                                                <button type="button" class="btn-close btn-sm"
                                                                    data-bs-dismiss="modal" aria-hidden="true"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <form class="row mb-0" id="template-reviewform"
                                                                    name="template-reviewform" action="#"
                                                                    method="post">
                                                                    <div class="col-6 mb-3">
                                                                        <label
                                                                            for="template-reviewform-name">Name<small>*</small></label>
                                                                        <div class="input-group">
                                                                            <div class="input-group-text">
                                                                                <i class="uil uil-user"></i>
                                                                            </div>
                                                                            <input type="text"
                                                                                id="template-reviewform-name"
                                                                                name="template-reviewform-name"
                                                                                value=""
                                                                                class="form-control required">
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-6 mb-3">
                                                                        <label
                                                                            for="template-reviewform-email">Email<small>*</small></label>
                                                                        <div class="input-group">
                                                                            <div class="input-group-text">@</div>
                                                                            <input type="email"
                                                                                id="template-reviewform-email"
                                                                                name="template-reviewform-email"
                                                                                value=""
                                                                                class="required email form-control">
                                                                        </div>
                                                                    </div>
                                                                    <div class="w-100"></div>
                                                                    <div class="col-12 mb-3">
                                                                        <label
                                                                            for="template-reviewform-rating">Rating</label>
                                                                        <select id="template-reviewform-rating"
                                                                            name="template-reviewform-rating"
                                                                            class="form-select">
                                                                            <option value="">-- Select One --
                                                                            </option>
                                                                            <option value="1">1</option>
                                                                            <option value="2">2</option>
                                                                            <option value="3">3</option>
                                                                            <option value="4">4</option>
                                                                            <option value="5">5</option>
                                                                        </select>
                                                                    </div>
                                                                    <div class="w-100"></div>
                                                                    <div class="col-12 mb-3">
                                                                        <label
                                                                            for="template-reviewform-comment">Comment<small>*</small></label>
                                                                        <textarea class="required form-control" id="template-reviewform-comment" name="template-reviewform-comment"
                                                                            rows="6" cols="30"></textarea>
                                                                    </div>
                                                                    <div class="col-12">
                                                                        <button class="button button-3d m-0"
                                                                            type="submit" id="template-reviewform-submit"
                                                                            name="template-reviewform-submit"
                                                                            value="submit">Submit Review</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary"
                                                                    data-bs-dismiss="modal">Close</button>
                                                            </div>
                                                        </div><!-- /.modal-content -->
                                                    </div><!-- /.modal-dialog -->
                                                </div><!-- /.modal -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
