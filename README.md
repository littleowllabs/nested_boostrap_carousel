Nested Bootstrap Carousel
=========================

Ever needed to nest a carousel within another carousel (you crazy guy). It is not possible with the original Bootstrap, so this modified version may be used instead. 

It can be used as follows:

```
<div id="carousel-example-generic" class="carousel slide" data-interval="false">
  
  <!-- Wrapper for slides -->
  <div class="carousel-inner">

        <!-- start of next carousel item -->
        <div class="item active">
          <div class="carousel-content">
            ...
          </div>
            
           <!-- start of nested carousel -->
           <div id="nested-carousel" class="nested-carousel slide" data-ride="nested-carousel" data-interval="false">
              <!-- Wrapper for slides -->
              <div class="nested-carousel-inner">
                <div class="nested-item nested-active">...</div>
                <div class="nested-item">...</div>
                <div class="nested-item">...</div>
              </div>

              <!-- Indicators -->
              <ol class="nested-carousel-indicators">
                <li data-target="#nested-carousel" data-nested-slide-to="0" class="nested-active"></li>
                <li data-target="#nested-carousel" data-nested-slide-to="1"></li>
                <li data-target="#nested-carousel" data-nested-slide-to="2"></li>
              </ol>

            </div>
           <!-- end of nested carousel -->

        </div>
        <!-- end of carousel item -->
    
    
        <!-- start of next carousel item -->
        <div class="item">
          <div class="carousel-content">...</div>
        </div>
        <!-- end of carousel item -->


  </div>

  <!-- Controls -->
  <a class="left carousel-control" href="#carousel-example-generic" data-slide="prev">
    <span class="icon-prev"></span>
  </a>
  <a class="right carousel-control" href="#carousel-example-generic" data-slide="next">
    <span class="icon-next"></span>
  </a>
</div>
```