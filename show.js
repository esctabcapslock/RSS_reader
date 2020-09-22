var a;
var Parser = new DOMParser();
var Alist = [];
var Alist_len = 0;

function Show_list(l){
    if (l!=Alist_len) return;
    document.getElementById('wrap').innerHTML='';
    console.log("끝남",Alist.length);
    Alist.sort((a,b)=>{return a.pubDate<b.pubDate ? true:false;});
    
    for (var i=0;i<Alist.length;i++){
        var id='eg'+i.toString();
        var E = document.createElement('div');
        var html = Alist[i].description.replace(/&gt;/g,'>').replace(/&lt;/g,'<') // '<','>'문자 치환.
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,""); //자바스트립트 테그제거

        document.getElementById('wrap').innerHTML+=`
        <div class='card'>
            <label for='${id}'>
            <span class='en' onclick='location.href="${Alist[i].link}"'>${Alist[i].title}</span>
            <span class='ko'>${Alist[i].pubDate.toString().replace("GMT+0000 (Coordinated Universal Time)","")}</span>
            <span class='teg'>${Alist[i].Title}</span>
             <div class='in' style="">${html}</div>
            </label>
            <input id="${id}" type="checkbox" onclick="hide(this)" style="display: none;">
        </div>`
        //&#x27;
        //https://stackoverflow.com/questions/6659351/removing-all-script-tags-from-html-with-js-regular-expression
    }
}

function hide(This){
    //console.log(This,This.parentElement.getElementsByClassName('in')[0]);
    var tlist = document.querySelectorAll('input[type="checkbox"]');
    for(var i=0;i<tlist.length;i++){
        tlist[i].parentElement.style.height='300px';
        if (tlist[i]!=This){
            tlist[i].checked=false;
            tlist[i].parentElement.getElementsByClassName('in')[0].style.display='node';
        }
    }
    
    if (This.checked){
    This.parentElement.style.height='100%'
    This.parentElement.getElementsByClassName('in')[0].style.display='block';
    
    }
    else{
        This.parentElement.style.height='300px'
    }
    window.scrollTo(0,This.parentElement.offsetTop);
}

function Arti(Title,title,link,description,pubDate){
    this.Title = Title;
    this.title = title;
    this.link = link;
    this.description = description;
    this.pubDate = pubDate;
}

function CreA(Title,title,link,description,pubDate){
    console.log(Title,title,link,pubDate)
    Alist.push(new Arti(Title,title,link,description,pubDate));
    Show_list(Alist.length);
}

function rss(_url){
     fetch('./rss/'+_url).then((응답)=>{
    return 응답.text();
    }).then((Data)=>{
        //console.log('data',Data);
         var El = Parser.parseFromString (Data.replace(/ & /g,"&amp;"),"text/xml");
         var Title = El.querySelector('title').innerHTML
         var El_list = El.querySelectorAll("rss>channel>item");
         Alist_len+=El_list.length;

         for (var i=0;i<El_list.length;i++) {
             CreA(
             Title,
             El_list[i].querySelector("title").innerHTML,
             El_list[i].querySelector("link").innerHTML,
             El_list[i].querySelector("description").innerHTML,
             new Date(El_list[i].querySelector("pubDate").innerHTML)
         )
         }
     });
}

fetch('./list').then((응답)=>{
return 응답.text();
}).then((Data)=>{
a=JSON.parse(Data);
for(var i=0;i<a.length;i++){
    rss(a[i].url)
}
})