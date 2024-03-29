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
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
   <script type="text/javascript" src="<?php the_asset('vendor.js'); ?>"></script>
   <script id="wplemon-app-js-extra">
      var bp_site = {
         "dist": "http:\/\/basebuilder-config.local\/tests\/dist\/",
      };
   </script>
   <script type="text/javascript" src="<?php the_asset('app.js'); ?>"></script>
</head>

<body>
   <h1>I should be a Montserrat</h1>
   <div class="icon-logo-linkedin"></div>
   <img src="<?php the_asset('images/logo.svg'); ?>" alt="">
</body>

</html>