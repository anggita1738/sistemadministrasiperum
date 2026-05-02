<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Sistem Administrasi Perumahan - Kelola Penghuni, Rumah, Iuran, dan Laporan Keuangan">
    <title>Sistem Administrasi Perumahan</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    @php
        $jsFiles = glob(public_path('assets/*.js'));
        $cssFiles = glob(public_path('assets/*.css'));
        
        $jsPath = $jsFiles ? '/assets/' . basename($jsFiles[0]) : '';
        $cssPath = $cssFiles ? '/assets/' . basename($cssFiles[0]) : '';
    @endphp

    @if($jsPath)
        <script type="module" crossorigin src="{{ $jsPath }}"></script>
    @endif
    @if($cssPath)
        <link rel="stylesheet" crossorigin href="{{ $cssPath }}">
    @endif
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
