<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/functions.php';


?>
<!DOCTYPE html>
<html lang="en">

<head>
   <link rel="stylesheet" href="<?php the_asset('app.css'); ?>">
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <title>HTML 5 Boilerplate</title>
</head>

<body>
   <h1>I should be a Montserrat</h1>
   <div class="icon-logo-linkedin"></div>
   <img src="<?php the_asset('images/logo.svg'); ?>" alt="">

   <script src="<?php the_asset('vendor.js'); ?>"></script>
   <script src="<?php the_asset('app.js'); ?>"></script>
</body>

</html>