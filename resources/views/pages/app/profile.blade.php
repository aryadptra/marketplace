@extends('layouts.app')

@section('title', 'Profile')

@section('content')
    <div class="container mt-5">
        <div class="row gx-5">
            <div class="col-md-9">
                <img src="/app/assets/images/icons/avatar.jpg" class="alignleft img-circle img-thumbnail my-0" alt="Avatar"
                    style="max-width: 84px;">
                <div class="heading-block border-0">
                    <h3>{{ Auth::user()->name }}</h3>
                    <span>Customer</span>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div>
                            <ul class="nav canvas-alt-tabs tabs-alt tabs nav-tabs mb-3" id="tabs-profile" role="tablist"
                                style="--bs-nav-link-font-weight: 600;">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="canvas-home-alt-tab" data-bs-toggle="pill"
                                        data-bs-target="#home-alt" type="button" role="tab"
                                        aria-controls="canvas-home-alt" aria-selected="true"><i
                                            class="fa-solid fa-rss me-1"></i> Feeds</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="canvas-profile-alt-tab" data-bs-toggle="pill"
                                        data-bs-target="#profile-alt" type="button" role="tab"
                                        aria-controls="canvas-profile-alt" aria-selected="false" tabindex="-1"><i
                                            class="bi-pencil me-1"></i> Posts</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="canvas-contact-alt-tab" data-bs-toggle="pill"
                                        data-bs-target="#contact-alt" type="button" role="tab"
                                        aria-controls="canvas-contact-alt" aria-selected="false" tabindex="-1"><i
                                            class="bi-reply me-1"></i> Replies</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="canvas-about-alt-tab" data-bs-toggle="pill"
                                        data-bs-target="#about-alt" type="button" role="tab"
                                        aria-controls="canvas-about-alt" aria-selected="false" tabindex="-1"><i
                                            class="bi-person me-1"></i> Connections</button>
                                </li>
                            </ul>
                            <div id="canvas-TabContent2" class="tab-content">
                                <div class="tab-pane fade show active" id="home-alt" role="tabpanel"
                                    aria-labelledby="canvas-home-tab" tabindex="0">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium harum ea quo!
                                        Nulla fugiat earum, sed corporis amet iste non, id facilis dolorum, suscipit,
                                        deleniti ea. Nobis, temporibus magnam doloribus. Reprehenderit necessitatibus esse
                                        dolor tempora ea unde, itaque odit. Quos.</p>
                                    <table class="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Time</th>
                                                <th>Activity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <code>5/23/2021</code>
                                                </td>
                                                <td>Payment for VPS2 completed</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <code>5/23/2021</code>
                                                </td>
                                                <td>Logged in to the Account at 16:33:01</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <code>5/22/2021</code>
                                                </td>
                                                <td>Logged in to the Account at 09:41:58</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <code>5/21/2021</code>
                                                </td>
                                                <td>Logged in to the Account at 17:16:32</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <code>5/18/2021</code>
                                                </td>
                                                <td>Logged in to the Account at 22:53:41</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="tab-pane fade" id="contact-alt" role="tabpanel"
                                    aria-labelledby="canvas-contact-tab" tabindex="0">

                                    <div class="row gutter-40 posts-md mt-4">
                                        <div class="entry col-12">
                                            <div class="grid-inner row align-items-center g-0">
                                                <div class="col-md-4">
                                                    <a class="entry-image" href="images/blog/full/17.jpg"
                                                        data-lightbox="image"><img src="images/blog/small/17.jpg"
                                                            alt="Standard Post with Image"></a>
                                                </div>
                                                <div class="col-md-8 ps-md-4">
                                                    <div class="entry-title title-sm">
                                                        <h3><a href="blog-single.html">This is a Standard post with a
                                                                Preview Image</a></h3>
                                                    </div>
                                                    <div class="entry-meta">
                                                        <ul>
                                                            <li><i class="uil uil-schedule"></i> 10th Feb 2021</li>
                                                            <li><a href="blog-single.html#comments"><i
                                                                        class="uil uil-comments-alt"></i> 13</a></li>
                                                            <li><a href="#"><i class="uil uil-camera"></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="entry-content">
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                                                        <a href="blog-single.html" class="more-link">Read More</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="entry col-12">
                                            <div class="grid-inner row align-items-center g-0">
                                                <div class="col-md-4">
                                                    <div class="entry-image">
                                                        <div class="fluid-width-video-wrapper" style="padding-top: 56.2%;">
                                                            <iframe src="https://player.vimeo.com/video/87701971"
                                                                allow="autoplay; fullscreen" allowfullscreen=""
                                                                id="fitvid0"></iframe>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-8 ps-md-4">
                                                    <div class="entry-title title-sm">
                                                        <h3><a href="blog-single-full.html">This is a Standard post with an
                                                                Embedded Video</a></h3>
                                                    </div>
                                                    <div class="entry-meta">
                                                        <ul>
                                                            <li><i class="uil uil-schedule"></i> 16th Feb 2021</li>
                                                            <li><a href="blog-single-full.html#comments"><i
                                                                        class="uil uil-comments-alt"></i> 19</a></li>
                                                            <li><a href="#"><i class="uil uil-film"></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="entry-content">
                                                        <p>Asperiores, tenetur, blanditiis, quaerat odit ex exercitationem.
                                                        </p>
                                                        <a href="blog-single-full.html" class="more-link">Read More</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="entry col-12">
                                            <div class="grid-inner row align-items-center g-0">
                                                <div class="col-md-4">
                                                    <div class="entry-image">
                                                        <div class="fslider" data-arrows="false" data-lightbox="gallery">
                                                            <div class="flexslider">

                                                                <div class="flex-viewport"
                                                                    style="overflow: hidden; position: relative; height: 0px;">
                                                                    <div class="slider-wrap"
                                                                        style="width: 1000%; transition-duration: 0s; transform: translate3d(0px, 0px, 0px);">
                                                                        <div class="slide clone" aria-hidden="true"
                                                                            style="width: 0px; margin-right: 0px; float: left; display: block;">
                                                                            <a href="images/blog/full/21.jpg"
                                                                                data-lightbox=""><img
                                                                                    src="images/blog/small/21.jpg"
                                                                                    alt="Standard Post with Gallery"
                                                                                    draggable="false"></a>
                                                                        </div>
                                                                        <div class="slide flex-active-slide"
                                                                            style="width: 0px; margin-right: 0px; float: left; display: block;"
                                                                            data-thumb-alt=""><a
                                                                                href="images/blog/full/10.jpg"
                                                                                data-lightbox="gallery-item"><img
                                                                                    src="images/blog/small/10.jpg"
                                                                                    alt="Standard Post with Gallery"
                                                                                    draggable="false"></a></div>
                                                                        <div class="slide" data-thumb-alt=""
                                                                            style="width: 0px; margin-right: 0px; float: left; display: block;">
                                                                            <a href="images/blog/full/20.jpg"
                                                                                data-lightbox="gallery-item"><img
                                                                                    src="images/blog/small/20.jpg"
                                                                                    alt="Standard Post with Gallery"
                                                                                    draggable="false"></a>
                                                                        </div>
                                                                        <div class="slide" data-thumb-alt=""
                                                                            style="width: 0px; margin-right: 0px; float: left; display: block;">
                                                                            <a href="images/blog/full/21.jpg"
                                                                                data-lightbox="gallery-item"><img
                                                                                    src="images/blog/small/21.jpg"
                                                                                    alt="Standard Post with Gallery"
                                                                                    draggable="false"></a>
                                                                        </div>
                                                                        <div class="slide clone"
                                                                            style="width: 0px; margin-right: 0px; float: left; display: block;"
                                                                            aria-hidden="true"><a
                                                                                href="images/blog/full/10.jpg"
                                                                                data-lightbox=""><img
                                                                                    src="images/blog/small/10.jpg"
                                                                                    alt="Standard Post with Gallery"
                                                                                    draggable="false"></a></div>
                                                                    </div>
                                                                </div>
                                                                <ol class="flex-control-nav flex-control-paging">
                                                                    <li><a href="#" class="flex-active">1</a></li>
                                                                    <li><a href="#">2</a></li>
                                                                    <li><a href="#">3</a></li>
                                                                </ol>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-8 ps-md-4">
                                                    <div class="entry-title title-sm">
                                                        <h3><a href="blog-single-small.html">This is a Standard post with a
                                                                Slider Gallery</a></h3>
                                                    </div>
                                                    <div class="entry-meta">
                                                        <ul>
                                                            <li><i class="uil uil-schedule"></i> 24th Feb 2021</li>
                                                            <li><a href="blog-single-small.html#comments"><i
                                                                        class="uil uil-comments-alt"></i> 21</a></li>
                                                            <li><a href="#"><i class="uil uil-images"></i></a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="entry-content">
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                                                        <a href="blog-single-small.html" class="more-link">Read More</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="about-alt" role="tabpanel"
                                    aria-labelledby="canvas-about-tab" tabindex="0">
                                    <div class="clear mt-4"></div>
                                    <ol class="commentlist border-0 m-0 p-0">
                                        <li class="comment even thread-even depth-1" id="li-comment-1">
                                            <div id="comment-1" class="comment-wrap">
                                                <div class="comment-meta">
                                                    <div class="comment-author vcard">
                                                        <span class="comment-avatar">
                                                            <img alt="Image"
                                                                src="https://0.gravatar.com/avatar/ad516503a11cd5ca435acc9bb6523536?s=60"
                                                                class="avatar avatar-60 photo avatar-default"
                                                                height="60" width="60"></span>
                                                    </div>
                                                </div>
                                                <div class="comment-content">
                                                    <div class="comment-author">John Doe<span><a href="#"
                                                                title="Permalink to this comment">April 24, 2012 at 10:46
                                                                am</a></span></div>
                                                    <p>Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Nullam
                                                        id dolor id nibh ultricies vehicula ut id elit. Integer posuere erat
                                                        a ante venenatis dapibus posuere velit aliquet.</p>
                                                    <a class="comment-reply-link" href="#"><i
                                                            class="bi-reply-fill"></i></a>
                                                </div>
                                                <div class="clear"></div>
                                            </div>
                                            <ul class="children">
                                                <li class="comment byuser comment-author-_smcl_admin odd alt depth-2"
                                                    id="li-comment-3">
                                                    <div id="comment-3" class="comment-wrap">
                                                        <div class="comment-meta">
                                                            <div class="comment-author vcard">
                                                                <span class="comment-avatar">
                                                                    <img alt="Image"
                                                                        src="https://1.gravatar.com/avatar/30110f1f3a4238c619bcceb10f4c4484?s=40&amp;d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D40&amp;r=G"
                                                                        class="avatar avatar-40 photo" height="40"
                                                                        width="40"></span>
                                                            </div>
                                                        </div>
                                                        <div class="comment-content">
                                                            <div class="comment-author"><a href="#"
                                                                    rel="external nofollow"
                                                                    class="url">SemiColon</a><span><a href="#"
                                                                        title="Permalink to this comment">April 25, 2012 at
                                                                        1:03 am</a></span></div>
                                                            <p>Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
                                                            <a class="comment-reply-link" href="#"><i
                                                                    class="bi-reply-fill"></i></a>
                                                        </div>
                                                        <div class="clear"></div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                        <div class="tab-pane fade" id="profile-alt" role="tabpanel"
                                            aria-labelledby="canvas-profile-tab" tabindex="0">
                                            <div class="comment-wrap">
                                                <div class="comment-meta">
                                                    <div class="comment-author vcard">
                                                        <span class="comment-avatar">
                                                            <img alt="Image"
                                                                src="https://1.gravatar.com/avatar/30110f1f3a4238c619bcceb10f4c4484?s=60&amp;d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D60&amp;r=G"
                                                                class="avatar avatar-60 photo" height="60"
                                                                width="60"></span>
                                                    </div>
                                                </div>
                                                <div class="comment-content">
                                                    <div class="comment-author"><a
                                                            href="https://themeforest.net/user/semicolonweb"
                                                            rel="external nofollow" class="url">SemiColon</a><span><a
                                                                href="#" title="Permalink to this comment">April 25,
                                                                2012 at 1:03 am</a></span></div>
                                                    <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
                                                    </p>
                                                    <a class="comment-reply-link" href="#"><i
                                                            class="bi-reply-fill"></i></a>
                                                </div>
                                                <div class="clear"></div>
                                            </div>

                                        </div>
                                    </ol>
                                </div>
                                <div class="tab-content" id="tab-connections">
                                    <div class="row g-5 mt-4 mb-6">
                                        <div class="col-lg-3 col-md-6">
                                            <div class="team">
                                                <div class="team-image">
                                                    <img src="images/team/3.jpg" alt="John Doe">
                                                </div>
                                                <div class="team-desc">
                                                    <div class="team-title">
                                                        <h4>John Doe</h4><span>CEO</span>
                                                    </div>
                                                    <div class="d-flex justify-content-center mt-4">
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-facebook">
                                                            <i class="fa-brands fa-facebook-f"></i>
                                                            <i class="fa-brands fa-facebook-f"></i>
                                                        </a>
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-twitter">
                                                            <i class="fa-brands fa-twitter"></i>
                                                            <i class="fa-brands fa-twitter"></i>
                                                        </a>
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-google">
                                                            <i class="fa-brands fa-google"></i>
                                                            <i class="fa-brands fa-google"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-3 col-md-6">
                                            <div class="team">
                                                <div class="team-image">
                                                    <img src="images/team/2.jpg" alt="Josh Clark">
                                                </div>
                                                <div class="team-desc">
                                                    <div class="team-title">
                                                        <h4>Josh Clark</h4><span>Co-Founder</span>
                                                    </div>
                                                    <div class="d-flex justify-content-center mt-4">
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-facebook">
                                                            <i class="fa-brands fa-facebook-f"></i>
                                                            <i class="fa-brands fa-facebook-f"></i>
                                                        </a>
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-twitter">
                                                            <i class="fa-brands fa-twitter"></i>
                                                            <i class="fa-brands fa-twitter"></i>
                                                        </a>
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-google">
                                                            <i class="fa-brands fa-google"></i>
                                                            <i class="fa-brands fa-google"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-3 col-md-6">
                                            <div class="team">
                                                <div class="team-image">
                                                    <img src="images/team/8.jpg" alt="Mary Jane">
                                                </div>
                                                <div class="team-desc">
                                                    <div class="team-title">
                                                        <h4>Mary Jane</h4><span>Sales</span>
                                                    </div>
                                                    <div class="d-flex justify-content-center mt-4">
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-facebook">
                                                            <i class="fa-brands fa-facebook-f"></i>
                                                            <i class="fa-brands fa-facebook-f"></i>
                                                        </a>
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-twitter">
                                                            <i class="fa-brands fa-twitter"></i>
                                                            <i class="fa-brands fa-twitter"></i>
                                                        </a>
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-google">
                                                            <i class="fa-brands fa-google"></i>
                                                            <i class="fa-brands fa-google"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-3 col-md-6">
                                            <div class="team">
                                                <div class="team-image">
                                                    <img src="images/team/4.jpg" alt="Nix Maxwell">
                                                </div>
                                                <div class="team-desc">
                                                    <div class="team-title">
                                                        <h4>Nix Maxwell</h4><span>Support</span>
                                                    </div>
                                                    <div class="d-flex justify-content-center mt-4">
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-facebook">
                                                            <i class="fa-brands fa-facebook-f"></i>
                                                            <i class="fa-brands fa-facebook-f"></i>
                                                        </a>
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-twitter">
                                                            <i class="fa-brands fa-twitter"></i>
                                                            <i class="fa-brands fa-twitter"></i>
                                                        </a>
                                                        <a href="#"
                                                            class="social-icon si-small bg-light rounded-circle h-bg-google">
                                                            <i class="fa-brands fa-google"></i>
                                                            <i class="fa-brands fa-google"></i>
                                                        </a>
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
            <div class="w-100 line d-block d-md-none"></div>
            <div class="col-md-3">
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Profile</div><i class="uil uil-user"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Servers</div><i class="bi-laptop"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Messages</div><i class="bi-envelope"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Billing</div><i class="bi-credit-card"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Settings</div><i class="bi-gear-fill"></i>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between">
                        <div>Logout</div><i class="bi-box-arrow-left"></i>
                    </a>
                </div>
                <div class="fancy-title mt-5 title-border">
                    <h4>About Me</h4>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum laboriosam, dignissimos veniam obcaecati.
                    Quasi eaque, odio assumenda porro explicabo laborum!</p>
                <div class="fancy-title mt-5 title-border">
                    <h4>Social Profiles</h4>
                </div>
                <a href="#" class="social-icon h-bg-facebook si-small rounded-circle bg-light" title="Facebook">
                    <i class="fa-brands fa-facebook-f"></i>
                    <i class="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" class="social-icon h-bg-google si-small rounded-circle bg-light" title="Google+">
                    <i class="fa-brands fa-google"></i>
                    <i class="fa-brands fa-google"></i>
                </a>
                <a href="#" class="social-icon h-bg-dribbble si-small rounded-circle bg-light" title="Dribbble">
                    <i class="fa-brands fa-dribbble"></i>
                    <i class="fa-brands fa-dribbble"></i>
                </a>
                <a href="#" class="social-icon h-bg-flickr si-small rounded-circle bg-light" title="Flickr">
                    <i class="fa-brands fa-flickr"></i>
                    <i class="fa-brands fa-flickr"></i>
                </a>
                <a href="#" class="social-icon h-bg-linkedin si-small rounded-circle bg-light" title="LinkedIn">
                    <i class="fa-brands fa-linkedin"></i>
                    <i class="fa-brands fa-linkedin"></i>
                </a>
                <a href="#" class="social-icon h-bg-twitter si-small rounded-circle bg-light" title="Twitter">
                    <i class="fa-brands fa-twitter"></i>
                    <i class="fa-brands fa-twitter"></i>
                </a>
            </div>
        </div>
    </div>
@endsection
