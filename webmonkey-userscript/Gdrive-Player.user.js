// ==UserScript==
// @name         Gdrive Player - Google Drive Proxy API
// @description  Watch videos in external player.
// @version      1.0.1
// @match        *://gdriveplayer.co/*
// @match        *://*.gdriveplayer.co/*
// @match        *://gdriveplayer.io/*
// @match        *://*.gdriveplayer.io/*
// @match        *://gdriveplayer.me/*
// @match        *://*.gdriveplayer.me/*
// @match        *://gdriveplayer.to/*
// @match        *://*.gdriveplayer.to/*
// @match        *://gdriveplayer.us/*
// @match        *://*.gdriveplayer.us/*
// @match        *://databasegdriveplayer.co/*
// @match        *://*.databasegdriveplayer.co/*
// @match        *://databasegdriveplayer.me/*
// @match        *://*.databasegdriveplayer.me/*
// @match        *://databasegdriveplayer.xyz/*
// @match        *://*.databasegdriveplayer.xyz/*
// @match        *://zeydhan.me/*
// @match        *://*.zeydhan.me/*
// @icon         https://gdriveplayer.to/favicon.ico
// @run-at       document-end
// @homepage     https://github.com/warren-bank/crx-Gdrive-Player/tree/webmonkey-userscript/es5
// @supportURL   https://github.com/warren-bank/crx-Gdrive-Player/issues
// @downloadURL  https://github.com/warren-bank/crx-Gdrive-Player/raw/webmonkey-userscript/es5/webmonkey-userscript/Gdrive-Player.user.js
// @updateURL    https://github.com/warren-bank/crx-Gdrive-Player/raw/webmonkey-userscript/es5/webmonkey-userscript/Gdrive-Player.user.js
// @namespace    warren-bank
// @author       Warren Bank
// @copyright    Warren Bank
// ==/UserScript==

// ----------------------------------------------------------------------------- constants

var user_options = {
  "ms_delay_before_process_page": 1000,

  "redirect_to_webcast_reloaded": true,
  "force_http":                   true,
  "force_https":                  false
}

// ----------------------------------------------------------------------------- URL links to tools on Webcast Reloaded website

var get_webcast_reloaded_url = function(video_url, vtt_url, referer_url, force_http, force_https) {
  force_http  = (typeof force_http  === 'boolean') ? force_http  : user_options.force_http
  force_https = (typeof force_https === 'boolean') ? force_https : user_options.force_https

  var encoded_video_url, encoded_vtt_url, encoded_referer_url, webcast_reloaded_base, webcast_reloaded_url

  encoded_video_url     = encodeURIComponent(encodeURIComponent(btoa(video_url)))
  encoded_vtt_url       = vtt_url ? encodeURIComponent(encodeURIComponent(btoa(vtt_url))) : null
  referer_url           = referer_url ? referer_url : unsafeWindow.location.href
  encoded_referer_url   = encodeURIComponent(encodeURIComponent(btoa(referer_url)))

  webcast_reloaded_base = {
    "https": "https://warren-bank.github.io/crx-webcast-reloaded/external_website/index.html",
    "http":  "http://webcast-reloaded.surge.sh/index.html"
  }

  webcast_reloaded_base = (force_http)
                            ? webcast_reloaded_base.http
                            : (force_https)
                               ? webcast_reloaded_base.https
                               : (video_url.toLowerCase().indexOf('http:') === 0)
                                  ? webcast_reloaded_base.http
                                  : webcast_reloaded_base.https

  webcast_reloaded_url  = webcast_reloaded_base + '#/watch/' + encoded_video_url + (encoded_vtt_url ? ('/subtitle/' + encoded_vtt_url) : '') + '/referer/' + encoded_referer_url
  return webcast_reloaded_url
}

// ----------------------------------------------------------------------------- URL redirect

var redirect_to_url = function(url) {
  if (!url) return

  if (typeof GM_loadUrl === 'function') {
    if (typeof GM_resolveUrl === 'function')
      url = GM_resolveUrl(url, unsafeWindow.location.href)

    GM_loadUrl(url, 'Referer', unsafeWindow.location.href)
  }
  else {
    try {
      unsafeWindow.top.location = url
    }
    catch(e) {
      unsafeWindow.window.location = url
    }
  }
}

var process_video_url = function(video_url, video_type, referer_url) {
  if (!referer_url)
    referer_url = unsafeWindow.location.href

  if (typeof GM_startIntent === 'function') {
    // running in Android-WebMonkey: open Intent chooser
    GM_startIntent(/* action= */ 'android.intent.action.VIEW', /* data= */ video_url, /* type= */ video_type, /* extras: */ 'referUrl', referer_url)
    return true
  }
  else if (user_options.redirect_to_webcast_reloaded) {
    // running in standard web browser: redirect URL to top-level tool on Webcast Reloaded website
    redirect_to_url(get_webcast_reloaded_url(video_url, /* vtt_url= */ null, referer_url))
    return true
  }
  else {
    return false
  }
}

var process_hls_url = function(hls_url, referer_url) {
  process_video_url(hls_url, /* video_type= */ 'application/x-mpegurl', referer_url)
}

// ----------------------------------------------------------------------------- process server error

var domain_mirrors = [
  'databasegdriveplayer.xyz',
  'databasegdriveplayer.me',
  'databasegdriveplayer.co',
  'gdriveplayer.us',
  'gdriveplayer.to',
  'gdriveplayer.me',
  'gdriveplayer.io',
  'gdriveplayer.co'
]

var hostname_regex = /^((?:[^\.]+\.)*)([^\.]+\.[^\.]+$)/

var validate_server_response = function() {
  var is_error = false

  if (!is_error && unsafeWindow.document.body.classList.contains('neterror'))
    is_error = true

  if (!is_error) {
    try {
      var h1 = unsafeWindow.document.querySelector('body > h1')
      if (!h1) throw ''

      var h1_text = h1.innerHTML.trim().toLowerCase()
      if (h1_text !== 'not found') throw ''

      is_error = true
    }
    catch(error) {}
  }

  if (is_error) {
    try {
      var matches = hostname_regex.exec(unsafeWindow.location.hostname.toLowerCase())
      if (matches == null) throw ''

      var subdomain         = matches[1]
      var current_domain    = matches[2]
      var current_index     = domain_mirrors.indexOf(current_domain)
      var redirect_index    = (current_index + 1) % domain_mirrors.length
      var redirect_domain   = domain_mirrors[redirect_index]
      var redirect_hostname = subdomain + redirect_domain
      var redirect_url      = unsafeWindow.location.protocol + '//' + redirect_hostname + unsafeWindow.location.pathname + unsafeWindow.location.search

      redirect_to_url(redirect_url)
    }
    catch(error) {}
    return false
  }

  return true
}

// ----------------------------------------------------------------------------- process page

var validate_hls_querystring = function() {
  if (unsafeWindow.location.search.indexOf('hls=true') >= 0)
    return true

  var redirect_url =
    unsafeWindow.location.protocol + '//' + unsafeWindow.location.hostname + unsafeWindow.location.pathname +
    ((unsafeWindow.location.search) ? (unsafeWindow.location.search + '&') : '?') + 'from=proxy&hls=true'

  redirect_to_url(redirect_url)
  return false
}

var process_page = function() {
  var current_url = unsafeWindow.location.href
  if (('function' === (typeof GM_getUrl)) && (GM_getUrl() !== current_url)) return

  if ((unsafeWindow.location.pathname.indexOf('player') >= 0) && !validate_hls_querystring()) return

  var sources, video_url
  try {
    sources   = jwplayer().getConfig().sources
    video_url = sources[0].file
  }
  catch(error) {
  }

  if (!video_url || ('string' !== (typeof video_url))) {
    validate_server_response()
    return
  }

  if (!validate_hls_querystring()) return

  if (video_url.indexOf('http') !== 0) {
    if ('function' === (typeof GM_resolveUrl))
      video_url = GM_resolveUrl(video_url, current_url)
    else if ('function' === (typeof URL))
      video_url = (new URL(video_url, current_url)).href
    else
      video_url = unsafeWindow.location.protocol + '//' + unsafeWindow.location.hostname + '/' + video_url
  }

  video_url += '#video.m3u8'

  process_hls_url(video_url)
}

setTimeout(process_page, user_options.ms_delay_before_process_page)

// -----------------------------------------------------------------------------
