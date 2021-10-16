<?php

/**
 * Returns the current path of the provided asset
 *
 * @param string $asset the name of the asset including the actual path
 * @return string
 */
function get_asset($asset, string $return_variant = null)
{
   $manifest = __DIR__ . '/dist/manifest.json';
   if (file_exists($manifest)) {
      $manifest = file_get_contents($manifest);
      $json = json_decode($manifest, true);

      if (isset($json[$asset])) {
         $file = $json[$asset];

         switch ($return_variant) {
            case 'path':
               return __DIR__ . '/dist/' . $file;
               break;
            case 'contents':
               return file_get_contents(__DIR__ . '/dist/' . $file, true);
               break;
            default:
               return "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" . 'dist/' . $file;
               break;
         }
      } else {
         return sprintf('File %s not found.', $asset);
      }
   }
}

/**
 * Echoes get_asset
 *
 * @param string $asset the name of the asset including the actual path
 * @return string
 */
function the_asset($asset)
{
   echo get_asset($asset);
}
