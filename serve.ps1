# 포트폴리오 로컬 서버 — http://localhost:8000 으로 사이트를 엽니다.
# YouTube 임베드는 file:// 로 열면 오류 153이 나서, http 주소로 열어야 재생돼요.
# 실행: serve.bat 더블클릭, 또는 PowerShell에서  .\serve.ps1   (끄기: Ctrl + C)
param([int]$Port = 8000)

$root = $PSScriptRoot
$prefix = "http://localhost:$Port/"
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'; '.gif' = 'image/gif'; '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'
  '.pdf' = 'application/pdf'; '.mp4' = 'video/mp4'; '.woff2' = 'font/woff2'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() } catch {
  Write-Host "포트 $Port 을(를) 열 수 없어요. 이미 서버가 켜져 있거나 다른 프로그램이 쓰는 중이에요." -ForegroundColor Red
  Write-Host "다른 포트로 실행:  .\serve.ps1 -Port 8080"
  exit 1
}

Write-Host ""
Write-Host "  포트폴리오 서버 실행 중 →  $prefix" -ForegroundColor Green
Write-Host "  끄려면 이 창에서 Ctrl + C" -ForegroundColor DarkGray
Write-Host ""
Start-Process $prefix

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request; $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
      if ($rel -eq '') { $rel = 'index.html' }
      $full = [IO.Path]::GetFullPath((Join-Path $root $rel))
      if ((Test-Path $full -PathType Container)) { $full = Join-Path $full 'index.html' }

      $res.Headers.Add('Referrer-Policy', 'strict-origin-when-cross-origin')
      $res.Headers.Add('Cache-Control', 'no-cache')
      if (-not $full.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $full -PathType Leaf)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes("404 — $rel 파일이 없어요")
        $res.ContentType = 'text/plain; charset=utf-8'
      } else {
        $ext = [IO.Path]::GetExtension($full).ToLower()
        $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
        $bytes = [IO.File]::ReadAllBytes($full)
      }
      $res.ContentLength64 = $bytes.Length
      if ($req.HttpMethod -ne 'HEAD') { $res.OutputStream.Write($bytes, 0, $bytes.Length) }
      Write-Host ("{0} {1} {2}" -f $res.StatusCode, $req.HttpMethod, $req.Url.AbsolutePath) -ForegroundColor DarkGray
    } catch {
      Write-Host "오류: $_" -ForegroundColor Red
    } finally {
      $res.OutputStream.Close()
    }
  }
} finally {
  $listener.Stop()
}
