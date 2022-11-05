var UptimeRobotCustomRatios = [
    {Class: 'hidden-xs hidden-sm', Days: '1'},
    {Class: 'hidden-xs', Days: '7'},
    {Class: '', Days: '30'},
    {Class: 'hidden-xs', Days: '90'},
    {Class: 'hidden-xs', Days: '180'},
    {Class: 'hidden-xs', Days: '365'},
];
var UptimeRobotResponse = null;
var UptimeRobotStatuses = [];
UptimeRobotStatuses[0] = {Class: 'text-primary', Text: 'Paused'};
UptimeRobotStatuses[1] = {Class: 'text-primary', Text: 'Not checked yet'};
UptimeRobotStatuses[2] = {Class: 'text-success', Text: 'Up'};
UptimeRobotStatuses[8] = {Class: 'text-danger', Text: 'Seems down'};
UptimeRobotStatuses[9] = {Class: 'text-danger', Text: 'Down'};

$(document).ready(function () {
    var url = 'https://api.uptimerobot.com/v2/getMonitors';
    var params = {
        'api_key': 'ur102810-9516ca7ac2e8ec30ab14b14b',
        'custom_uptime_ratios': $.map(UptimeRobotCustomRatios, function(val) { return val.Days; }).join('-'),
    }
    $.post(url, params, function(data) {
        if (data.stat = 'ok') {
            UptimeRobotResponse = data;
            LoadProxyServers();
        } else {
            alert('Error retrieving proxy status.  Please wait a minute and try reloading this page.');
        }
    }).fail(function() {
        alert('Error retrieving proxy status.  Please wait a minute and try reloading this page.');
    });
    
		$('[data-toggle="popover"]').popover();
});

/*$('#cboProxyServer').change(function () {
    var Settings = GetSettings();
    Settings.ProxyServer = $(this).val();
    SetSettings(Settings);
});*/

function GetUptimeRobotStatus(rowIndex, hostname, wsPort, wssPort) {
    for (var j = 0; j < UptimeRobotResponse.monitors.length; j++) {
        var monitor = UptimeRobotResponse.monitors[j];
        if (monitor.url != hostname) {
            continue;
        }
        
        var PingUrl;
        if (location.protocol === 'https:') {
            PingUrl = 'wss://' + hostname + ':' + wssPort;
        } else {
            PingUrl = 'ws://' + hostname + ':' + wsPort;
        }
        Ping(PingUrl, function(ms) {
            var IntegerMS = parseInt(ms);
            if (isNaN(IntegerMS)) {
                // Error result like ERROR or TIMEOUT
                var Class = 'text-danger';
            } else if (IntegerMS == ms) {
                // Non-asterisk result, means a ping time
                var Class = (IntegerMS <= 90 ? 'text-success' : (IntegerMS <= 300 ? 'text-warning' : 'text-danger'));
            } else {
                // Asterisk result, means a connection opened time
                var Class = (IntegerMS <= 200 ? 'text-success' : (IntegerMS <= 500 ? 'text-warning' : 'text-danger'));
            }
            $('#tblProxyServers tbody tr:eq(' + rowIndex + ') td:eq(2)').html('<span class="' + Class + '">' + ms + '</span>');
        });
    
        var Status = UptimeRobotStatuses[monitor.status];
        $('#tblProxyServers tbody tr:eq(' + rowIndex + ') td:eq(3)').html('<span class="' + Status.Class + '">' + Status.Text + '</span>');
        var Uptimes = monitor.custom_uptime_ratio.split('-');
        for (var k = 0; k < Uptimes.length; k++) {
            var Class = (Uptimes[k] >= 99 ? 'text-success' : (Uptimes[k] >= 98 ? 'text-warning' : 'text-danger'));
            $('#tblProxyServers tbody tr:eq(' + rowIndex + ') td:eq(' + (4 + k) + ')').html('<span class="' + Class + '">' + Uptimes[k] + '%</span>');
        }
    }
}

function LoadProxyServers() {
    $.getJSON('//embed-v2.ftelnet.ca/proxy-servers.json', function(data) {
        var rowCount = 0;
        for (key in data) {
            // Only process if the server has a Hostname property.  Some are only CNAMEs that redirect to real servers, and we don't want to list those
            var server = data[key];
            if (server['Hostname']) {
                var NewRow = '<tr>';
                NewRow += ' <td>' + server.Country + '<br />' + server.City + '</td>';
                NewRow += ' <td>' + server.Hostname + '<br />';
                NewRow += '<a href="http://embed.ftelnet.ca/?Hostname=bbs.ftelnet.ca&Port=23&Proxy=' + server.Hostname + '&ProxyPort=' + server.WsPort + '&ProxyPortSecure=' + server.WssPort + '&AutoConnect=false" target="_blank" style="text-decoration: none;">ws:' + server.WsPort + '</a>,';
                NewRow += '&nbsp;<a href="https://embed.ftelnet.ca/?Hostname=bbs.ftelnet.ca&Port=23&Proxy=' + server.Hostname + '&ProxyPort=' + server.WsPort + '&ProxyPortSecure=' + server.WssPort + '&AutoConnect=false" target="_blank" style="text-decoration: none;">wss:' + server.WssPort + '</a>';
                NewRow += ' </td>';
                NewRow += ' <td>...</td>'; // Ping
                NewRow += ' <td>...</td>'; // Status
                for (var j = 0; j < UptimeRobotCustomRatios.length; j++) {
                    NewRow += ' <td class="' + UptimeRobotCustomRatios[j].Class + '">...</td>'; // Uptime intervals
                }
                NewRow += '</tr>';
                $('#tblProxyServers tbody').append(NewRow);
                
                GetUptimeRobotStatus(rowCount, server.Hostname, server.WsPort, server.WssPort);
                rowCount += 1;
            }
        }
    });
}

function Ping(url, cb) {
    var Connected = false;
    var ws = new WebSocket(url + '/ping');
    var StartDate = new Date().getTime();
    
    ws.onerror = function(e) {
        ws = null;
        if (cb != null) { 
            var EndDate = new Date().getTime();
            cb('ERROR'); 
            cb = null;
        }
    };

    ws.onmessage = function(e) {
        if (cb != null) {
            var EndDate = new Date().getTime();
            cb(EndDate - StartDate);
            cb = null;
        }

        if (ws != null) {
            ws.close();
            ws = null;
        }
    };

    ws.onopen = function(e) {
        if (cb == null) {
            if (ws != null) {
                ws.close();
                ws = null;
            }
        } else {
            // Preliminary result (time to open connection to remote server)
            var EndDate = new Date().getTime();
            cb(EndDate - StartDate + '*');

            // Try for a proper ping result
            Connected = true; // Prevent setTimeout from setting 'TIMEOUT' if we don't get a proper ping result
            StartDate = new Date().getTime();
            ws.send(StartDate + "\r\n");
        }
    };
    
    setTimeout(function() { 
        if (cb != null) {
            if (!Connected) {
                var EndDate = new Date().getTime();
                cb('TIMEOUT');
            }
            cb = null;
        }

        if (ws != null) {
            ws.close();
            ws = null;
        }
    }, 5000);
}
