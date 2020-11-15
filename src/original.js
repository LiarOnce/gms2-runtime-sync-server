var xmlhttp;
(xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")).onreadystatechange = function () {
    if (4 == xmlhttp.readyState && 200 == xmlhttp.status) {
        var e = xmlhttp.responseText;
        try {
            var t = new ActiveXObject("Microsoft.XMLDOM");
            t.async = "false", t.loadXML(e)
        } catch (a) {
            try {
                t = (new DOMParser).parseFromString(e, "text/xml")
            } catch (e) {
                alert(e.message)
            }
        }
        var a = t.getElementsByTagName("rss")[0].getElementsByTagName("channel")[0].getElementsByTagName("item"),
            s = a[a.length - 1],
            m = s.getElementsByTagName("title")[0];
        alert("Latest version is " + m.innerHTML);
        var n = s.getElementsByTagName("enclosure")[0];
        n.select(), document.execCommand("Copy"), alert("enclosure copied");
        for (var l = n.getElementsByTagName("module"), r = 0; r < l.length; r++) l[r].select(), document.execCommand("Copy"), alert("module copied")
    }
}, xmlhttp.open("GET", "https://gms.yoyogames.com/Zeus-Runtime-NuBeta.rss", !0), xmlhttp.send();