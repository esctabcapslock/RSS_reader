var a;
var Parser = new DOMParser();
var Alist = [];
var Alist_len = 0;

function Show_list(l){
    if (l!=Alist_len) return;
    document.getElementById('wrap').innerHTML='';
    console.log("끝남",Alist.length);
    Alist.sort((a,b)=>{return a.pubDate<b.pubDate ? true:false
                       ;});
    
    for (var i=0;i<Alist.length;i++){
        var id='eg'+i.toString();
        var E = document.createElement('div');
        var html = Alist[i].description.replace(/&gt;/g,'>').replace(/&lt;/g,'<') // '<','>'문자 치환.
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,""); //자바스트립트 테그제거

        document.getElementById('wrap').innerHTML+=`
        <div class='card'>
            <input id="${id}" type="checkbox" onclick="hide(this)" style="display: none;">
            <label for='${id}'>
            <span class='en'><a href="${Alist[i].link}">${Alist[i].title}</a></span>
            <span class='ko'>${Alist[i].pubDate.toString().replace("GMT+0000 (Coordinated Universal Time)","")}</span>
            <span class='teg'>${Alist[i].Title}</span>
             <div class='in' style="">${html}</div>
            </label>
            
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
            tlist[i].parentElement.getElementsByClassName('in')[0].style.display='none';
        }
    }
    
    if (This.checked){
    This.parentElement.style.height='100%'
    This.parentElement.getElementsByClassName('in')[0].style.display='block';
    
    }
    else{
        This.parentElement.style.height='300px'
    }
    //console.log(This.parentElement.offsetTop, document.getElementById('wrap').offsetTop)
    window.scrollTo(0,This.parentElement.offsetTop + document.getElementById('wrap').offsetTop);
}

function Arti(Title,title,link,description,pubDate){
    this.Title = Title;
    this.title = title;
    this.link = link;
    this.description = description;
    this.pubDate = pubDate;
}

function CreA(Title,title,link,description,pubDate){
    //console.log(Title,title,link,pubDate)
    Alist.push(new Arti(Title,title,link,description,pubDate));
    Show_list(Alist.length);
}

function rss(_url){
     fetch('./rss/'+_url).then((응답)=>{
    return 응답.text();
    }).then((Data)=>{
        console.log('data',Data.length);
         var El = Parser.parseFromString (Data.replace(/ & /g,"&amp;"),"text/xml");
         var Title = El.querySelector('title').textContent
         var El_list = El.querySelectorAll("rss>channel>item");
         Alist_len+=El_list.length;

         for (var i=0;i<El_list.length;i++) {
             var date = new Date(El_list[i].querySelector("pubDate").textContent); //한국시간으로 변환
             date.setHours(date.getHours()+9)
             CreA(
             Title,
             El_list[i].querySelector("title").textContent,
             El_list[i].querySelector("link").textContent,
             El_list[i].querySelector("description").textContent,
             date
         )
         }
     });
}

fetch('./list').then((응답)=>{
return 응답.text();
}).then((Data)=>{
a=JSON.parse(Data);
console.log(a)
for(var i=0;i<a.length;i++){
    rss(a[i].url)
}
})