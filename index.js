//id title
//id description
//class .county for each counties
//4 different colors 
//data-fips data-education properties for each .county
//county for each provided data point
//match sample data 
//#legend
//4 colors
//#tooltip
//data-education property for #tooltip
const w = 1400;
const h = 1000;
const pdg = 100;
const edulink = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'
const countylink='https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'
const greenarr = ['#B2EC5D','#7CFC00','#66FF00','#77DD77','#03C03C']

var mdataArr=[];
var eduarr=[];
var meduarr=[];

document.addEventListener('DOMContentLoaded', function(){
  req = new XMLHttpRequest();
  req.open('GET',countylink,true);
  req.send()

  req.onload = function(){
    json = JSON.parse(req.responseText);
    createSpan(Object.keys(json.objects)+'idtiti')
    createSpan(json.objects.counties.geometries[15].id+'test')
    createSpan(Object.keys(json.objects.counties.geometries[9]))

    x.domain(getDomain(json.bbox,'x'));
    y.domain(getDomain(json.bbox,'y'));
    
    //req 2
    req2 = new XMLHttpRequest();
    req2.open('GET',edulink,true);
    req2.send()
    req2.onload = function(){
      jsonedu = JSON.parse(req2.responseText);
      //arrays

      function findById(countyId){
        for(var i=0;i<jsonedu.length;i++){
          if(jsonedu[i].fips==countyId){
            return jsonedu[i]
          }

        }
      }
      
      function drawMini(){
        var poly=[];
        var geos=json.objects.counties.geometries;

        for(var i=0;i<geos.length;i++){
          if(geos[i].type=='Polygon')//-----POLYGONS----------
          {
            poly.push(getPoly(geos[i].arcs,json.arcs))
            eduarr.push(findById(geos[i].id))
          }
          else if(geos[i].type=='MultiPolygon'){//---------------------------MULTIPOLYGONS------------
            var mdata = [];
            
            geos[i].arcs.forEach(a=>{
              mdata.push(getPoly(a,json.arcs))
            })
            
            meduarr.push(findById(geos[i].id,jsonedu))
            mdataArr.push(mdata)
            //multip(mdata)
          }else{
            console.log('error')
          }
        }
        return poly;
      }
      
      
      
      
      var poly = drawMini();
      // poly = poly.slice(0,50);
      console.log(x(poly[0][0].x)+100)
      console.log(poly[0])
      drawPolygons(poly);
      for(var i=0;i<mdataArr.length;i++){
        multip(mdataArr[i],meduarr[i])
      }
      console.log(eduarr.length+ " "+meduarr.length);
      console.log(eduarr[17].fips)
      
        function drawPolygons(poly){
          d3choro = d3.select(document.body.querySelector('svg'))
          d3choro.selectAll('polygon')
            .data(poly)
            .enter().append('polygon')
            .attr('points',function(d){
            return d.map(function(d){
              return [x(d.x),y(d.y)].join(',');
            }).join(' ')
          })
            .attr('class','county')
            .style('fill',d=>{
            return getGreenHue()
          })
            .attr('data-fips',(d,i)=>{return eduarr[i].fips})
            .attr('data-education',(d,i)=>{return eduarr[i].bachelorsOrHigher})
            .on('mouseover',function(d,i){
              tip.style('left',()=>{
                // console.log('test'+Math.round(x(d[0].x)))
                return Math.round(x(d[0].x)+100)+'px'
              }).style('top',()=>{
                return Math.round(y(d[0].y)-100)+'px'
              }).style('display','block')
                .html(eduarr[i].bachelorsOrHigher)
                .attr('data-education',()=>{return eduarr[i].bachelorsOrHigher})
            .attr('data-education',(d,i)=>{return eduarr[i].bachelorsOrHigher})
          }).on('mouseout',function(){
              tip.style('display','none')
          })
        }
      
    
    //multipolygon
      function multip(mdata,medu){
        var temp = document.querySelector('svg')
        d3chord = d3.select(temp)
        multi=d3chord.append('g').attr('class','county').attr('data-fips',(d,i)=>{return medu.fips}).attr('data-education',()=>{return medu.bachelorsOrHigher})
        .on('mouseover',function(){
          tip.html(medu.bachelorsOrHigher)
          .attr('data-education',()=>{return medu.bachelorsOrHigher})
        })
        
        // multi.append('circle').attr('cx',500).attr('cy',500).attr('r',50).style('fill','black')
          multi.selectAll('polygon')
          .data(mdata)
          .enter()
          .append('polygon')
          .attr('points',function(d){
            return d.map(function(d){
              return [x(d.x),y(d.y)].join(',');
            }).join(' ')
          }).style('fill',d=>{
            return getGreenHue();
          }).on('mouseover',function(d,i){
            tip.style('top',()=>{return Math.round(x(d[i].x)+100)+'px'})
            .style('left',()=>{return Math.round(y(d[i].y)-100)+'px'})
            .style('display','block')
          }).on('mouseout',function(){
            tip.style('display','none')
          })


      }
      
      
    }

    
    
    //getObject by given ID
    function find(givenID){
      var temp;
      json.objects.counties.geometries.forEach(a=>{
        if(a['id']==givenID)
          temp=Object.assign({},a)
      })
      return temp;
    }
    
    
    //draw map

    

    


    

    //---------------POLY-VARIABLE--------------
      //var test=find(4005)
      //var poly = [getPoly(find(4005).arcs,json.arcs)]

      //var poly = [getPoly(test.arcs,json.arcs)]
      
      //console.log(poly.length)
    // var poly = [{"x":10, "y":50},
    //     {"x":20,"y":20},
    //     {"x":50,"y":10},
    //     {"x":30,"y":30}];
      // var mdata = [];
      // var testt = find(2198);
      // createSpan(JSON.stringify(testt))
      // testt.arcs.forEach(a=>{
      //   createSpan(typeof a)
      //   mdata.push(getPoly(a,json.arcs))
      // })
      // var testFormatted;
      // createSpan(JSON.stringify(mdata[0]))
      // createSpan(JSON.stringify(getPoly(find(40109).arcs,json.arcs)))
    //multip(mdata)
      
      
      
    
    //var poly=drawMini();
    

    //multip(mdata)
      //-------------DRAW POLYGONS-AND-SVG-----------------------------------------------


    // x.domain([0, 50]);
    // y.domain([0, 50]);


    
    
    //-----------------------END ONLOAD-------------------------------
  }

})

// document.addEventListener('DOMContentLoaded',function(){

// })





//----------------HELPER-FUNCTIONS-----------------

function createSpan(text='pony'){
  var p=document.createElement('p');
  document.body.appendChild(p);
  p.style.color = 'red';
  p.textContent = text;
  
}

function createDiv(){
  var div = document.createElement('div');
  div.style.width='300px';
  div.style.height='300px';
  div.style.backgroundColor='lightgreen';
  div.setAttribute('contenteditable','true');
  document.body.appendChild(div)
}


function getPoly(arrOfArcs,arcsArr){
  //console.log(arrOfArcs);
  var aoas = arrOfArcs[0];
  var aid;
  var newArr=[];
  var isRev=false;
  for(var arcid=0;arcid<aoas.length;arcid++){
    //aoas[arcid] == arcs index for json.arcs
     aid = aoas[arcid]
    if(aid<0){
      aid=~aid;
      isRev = true;
    }//invert with bitwise NOT
    //console.log(arcsArr[aid])
    var x=0,y=0;
    var arr = arcsArr[aid];
    //console.log(arr)

    var tempArr=[]
    for(var i=0;i<arr.length;i++){
      x+=arr[i][0];
      y+=arr[i][1];
      tempArr.push({x,y})
    }
    tempArr=isRev?tempArr.reverse():tempArr;
    newArr=newArr.concat(tempArr)
    isRev=false;
    x=0,y=0;
  }
  //console.log(newArr)
  //console.log(newArr.length)
  var newFArr = formatArr(newArr).map(a=>{
    return {
      "x": a.x*tscale.x,
      "y": a.y*tscale.y
    }
  });
  //console.log(newFArr)
  return newFArr;
}

//domain
function getDomain(bbox,offset){
  if(offset=='x'){
    return [bbox[0]-ttranslate.x,bbox[2]-ttranslate.x]
  }else if(offset=='y'){
    return [bbox[1]-ttranslate.y,bbox[3]-ttranslate.y]
  }else{
    alert( 'FUCK YOU')
  }
}


function formatArr(arrU){
  var arr = arrU.map(a=>{
    return JSON.stringify(a)
  })
  for(var i=1;i<arr.length-1;i++){
    for(var j=i+1;j<arr.length-1;j++){
      if(arr[i]==arr[j]){
        arrU[i]=0;
      }
    }
  }
  arrU = arrU.filter(a=>a!=0)
  //console.log(arrU)
  return arrU;
}

function getGreenHue(){
  var rand = Math.floor(Math.random()*5)
  return greenarr[rand]
}

//----------CONTANTS-LIKE-SCALE-AND-TRANSFORM-FOR-D3-DOMAIN---------------------
const tscale = {
  x:0.009995801851947097,
  y:0.005844667153098606		
}
const ttranslate ={
  x:-56.77775821661018,
  y: 12.469025989284091
}



//------------SVG---TEMPLATE_-=------------------
d3choro = d3.select('body')
  .append('svg')
  .attr('width',w)
  .attr('height',h)
  .style('background-color', 'lightcyan')
    
    // title desc
    
d3choro.append('text')
  .text('USA TITLE')
  .attr('x',(w-2*pdg)/2)
  .attr('y',pdg/4)
  .attr('id','title')
d3choro.append('text')
  .attr('id','description')
  .attr('x',(w-2*pdg)/2) 
  .attr('y',pdg/4*2)
  .text('Description')

tip = d3.select('body').append('div')
  .attr('id','tooltip')
  .style('width','100px')
  .style('height','100px')
  .style('position','absolute')
  .style('display','none')
  .style('top','400px')
  .style('left','1100px')

legend = d3choro.append('g').attr('id','legend')
legend.append('text').attr('x',w/2).attr('y',h-pdg/4*3).text('legend').style('font-size','16px')
legend.selectAll('rect')
  .data(greenarr)
  .enter()
  .append('rect')
  .attr('width',30)
  .attr('height',30)
  .attr('x',(d,i)=>{return w/2+i*30})
  .attr('y',(d,i)=>h-pdg/4*2)
  .style('fill',(d,i)=>{
    return greenarr[i]
})

  // .attr('x',(w-2*pdg)/2)
  // .attr('y',(h-pdg/4*2))
  
const x = d3.scaleLinear().range([pdg,w-pdg]);
const y = d3.scaleLinear().range([pdg,h-pdg]);
//set domain


//helper req func 
 function  getJSON(req){
  var json;
  req = new XMLHttpRequest();
  req.open('GET',edulink,true);
  req.send()
  req.onload = function(){
    console.log('testreq2')
    json =   JSON.parse(req.responseText)
  }

}

