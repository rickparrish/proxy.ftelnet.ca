﻿<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

    <title>fTelnet Proxies | <!--#echo var="PageTitle" --></title>

    <link href="/css/bootstrap.Cyborg.min.css" rel="stylesheet"/>
    <link href="/css/site.css" rel="stylesheet"/>
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="/js/jquery-1.11.2.min.js"><\/script>')</script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <script>$.fn.modal || document.write('<script src="/js/bootstrap.min.js"><\/script>')</script>
    
    <script>
        $(document).ready(function () {
			// Handle HTTP to HTTPS
			//if ((window.location.protocol === 'http:') && (window.hostname !== 'localhost'))
			//	window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);

			// Mark the correct page as active
            if ((window.location.pathname != '') && (window.location.pathname != '/')) {
                $('ul.nav li').removeClass('active');
                var pageId = window.location.pathname.split('/')[1];
                $('ul.nav li#nav-' + pageId).addClass('active');
            }
        });
    </script>
</head>
<body>
    <!-- Fixed navbar -->
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">fTelnet Proxies</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li id="nav-index" class="active"><a href="/">Home</a></li>
                    <li id="nav-map"><a href="/map">Map</a></li>
                    <li id="nav-about"><a href="/about">About</a></li>
                    <li id="nav-contact"><a href="/contact">Contact</a></li>
                    <li id="nav-donate"><a href="/donate"><strong class="text-warning">Donate</strong></a></li>
                </ul>
            </div><!--/.nav-collapse -->
        </div>
    </div>

    <!-- Begin page content -->
    <div class="container">
        <div class="row">
