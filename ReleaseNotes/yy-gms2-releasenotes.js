function parseVersionNumber(_verString){var vParts=_verString.split(".");var ret={};ret.major="0"in vParts?parseInt(vParts[0]):0;ret.minor="1"in vParts?parseInt(vParts[1]):0;ret.revision="2"in vParts?parseInt(vParts[2]):0;ret.build="3"in vParts?parseInt(vParts[3]):0;return ret}function compareVersionNumber(a,b){var ret=b.majMinRev.major-a.majMinRev.major;if(ret==0){ret=b.majMinRev.minor-a.majMinRev.minor;if(ret==0){ret=b.majMinRev.revision-a.majMinRev.revision;if(ret==0){ret=b.majMinRev.build-a.majMinRev.build}}}return ret<0?-1:ret==0?0:1}function doReleaseNotes(_releaseNotesWinURI,_releaseNotesMacURI,_releaseNotesLinuxURI){_releaseNotesLinuxURI=typeof _releaseNotesLinuxURI!=="undefined"?_releaseNotesLinuxURI:_releaseNotesWinURI;var isMac=navigator.appVersion.indexOf("Mac")!=-1;var isLinux=navigator.appVersion.indexOf("Linux")!=-1||navigator.appVersion.indexOf("CrOS")!=-1;var releaseNotesURI=isMac?_releaseNotesMacURI:isLinux?_releaseNotesLinuxURI:_releaseNotesWinURI;$.get(releaseNotesURI,function(data){var $XML=$(data);var entries={};$XML.find("item").each(function(){var $this=$(this),item={title:$this.find("title").text(),link:$this.find("link").text(),description:$this.find("description").text(),pubDate:$this.find("pubDate").text(),release_notes:$this.find("comments").text(),author:$this.find("author").text(),majMinRev:parseVersionNumber($this.find("title").text().replace("Version ",""))};item.className=item.majMinRev.major+"-"+item.majMinRev.minor+"-"+item.majMinRev.revision;if(!(item.className in entries)){entries[item.className]=[]}entries[item.className].push(item)});var keys=[];for(var k in entries)keys.push(k);keys=keys.sort(function(a,b){return b.localeCompare(a)});for(var m=0;m<keys.length;++m){var e=keys[m];var items=entries[e].sort(compareVersionNumber);var item=items[0];if(item.release_notes=="")continue;var content=$(".content-div");if(m!=0){content=$(".older-ver-div")}var insert='<div class="'+item.className+'">';if(releaseNotesURI.includes("Runtime")){insert+='<h1 id="'+item.title.replace("Version ","")+'">'+item.title+"</h1>"}else if(item.link==undefined||item.link==""){insert+="<h1>"+item.title+"</h1>"}else{insert+='<h1><a href="'+item.link+'">'+item.title+" Download</a></h1>"}insert+="<small>"+item.pubDate+"</small><p>";if(item.description!=""){insert+="<p>"+'<dd class="description">'+item.description+"</dd><p>"}insert+="<p>";insert+=m!=0?'<label class="collapse" for="one"  onclick="$(\'.'+item.className+' .release-notes\').toggle()">Release Notes</label><input class="check-box-one" id="one" type="checkbox"><div class="index_list"><ol><div class="release-notes"></div></ol></div>':'<label>Release Notes</label><div class="index_list"><ol><div class="release-notes"></div></ol></div>';insert+="<p>";content.append(insert);var uriToUse=item.release_notes;uriToUse=uriToUse.replace("zeus.yoyogames.com",window.location.host);uriToUse=uriToUse.replace("gm2016.yoyogames.com",window.location.host);uriToUse=uriToUse.replace("http:",window.location.protocol);if(uriToUse!=""){$.get(uriToUse,function(innerdata){var release_notes="empty";if("release_notes"in innerdata){release_notes=innerdata.release_notes.join("")}if("version"in innerdata){var verNumber=parseVersionNumber(innerdata.version);className=verNumber.major+"-"+verNumber.minor+"-"+verNumber.revision;$("."+className+" .release-notes").append(release_notes)}},"json").fail(function(jqXHR,textStatis,errorThrown){console.log("failed uri="+uriToUse+" textStatus="+textStatis+" errorThrown="+errorThrown)})}}})}