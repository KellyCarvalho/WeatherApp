
$(function(){


// *** APIs ***
// clima, previsão 12 horas e previsão 5 dias: https://developer.accuweather.com/apis
// pegar coordenadas geográficas pelo nome da cidade: https://docs.mapbox.com/api/
// pegar coordenadas do IP: http://www.geoplugin.net
// gerar gráficos em JS: https://www.highcharts.com/demo
//curl -X GET "http://dataservice.accuweather.com/currentconditions/v1/28143?apikey=p1L6sdz0WkgGgV2CLVfp2IG9CqhAGABY&language=pt-br"


      var localCode;
var accuweatherAPI ="p1L6sdz0WkgGgV2CLVfp2IG9CqhAGABY";
var dados;
var habilitaCORS = 'https://cors-anywhere.herokuapp.com/';
var mapboxToken ="pk.eyJ1Ijoia2VsbHljYXJ2YWxobyIsImEiOiJja2dvYXA5aXkwOTh0MnNwZ2V5YTE0cGZoIn0.qb0RHoT2wTUnCKYc1dhuRw";
var parametros={};

var localCode;








function pegarLocalUsuario(lat,long){

  $.ajax({
    url:"http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+accuweatherAPI+"&q="+lat+"%2C"+long+"&language=pt-br",
    type:"GET",
    datatype:"json",
    success:function(data){
  

    //  console.log(data);
     
       localCode = data.Key;
       pegarTempoAtual(localCode);
      
    previsaoCincoDias(localCode);
   
    pegarPrevisaoHora(localCode);

    
    },error: function(){

    }

          });

}



 function pegarTempoAtual(localcode){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function(){
    if(this.readyState == 4 && this.status == 200){
var d = JSON.parse(this.responseText);


parametros.temperatura=d[0].Temperature.Metric.Value;
parametros.clima=d[0].WeatherText;

var iconNumber = d[0].WeatherIcon<=9?"0"+String(d[0].WeatherIcon):String(d[0].WeatherIcon);
enviarClima(d[0].Temperature.Metric.Value,clima=d[0].WeatherText,"https://developer.accuweather.com/sites/default/files/"+iconNumber+"-s.png");

preencherCampos();





    }
  };
 

 
xhttp.open("GET",habilitaCORS+"http://dataservice.accuweather.com/currentconditions/v1/"+localCode+"?apikey="+accuweatherAPI+"&language=pt-br",true);
xhttp.send();
} 

function enviarCidade(pais,estado,cidade){
  parametros.pais=pais;
  parametros.estado=estado;
  parametros.cidade=cidade;


}

function enviarClima(temperatura,clima,icone){
  parametros.temperatura=temperatura;
  parametros.clima=clima;
  parametros.icone=icone;

}



function pegarCoordenadasDoIP() {
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       dados =JSON.parse(this.responseText);

       
        

       parametros.pais=dados.geoplugin_countryName;
        parametros.cidade=dados.geoplugin_city;
        parametros.estado=dados.geoplugin_region; 
        
       
        enviarCidade(dados.geoplugin_countryName,dados.geoplugin_region,dados.geoplugin_city);
        pegarLocalUsuario(dados.geoplugin_latitude,dados.geoplugin_longitude);
        preencherCampos();
        
        
        
      
       
      }
    };

    
    xhttp.open("GET", "http://www.geoplugin.net/json.gp?", true);
    xhttp.send();
  }



  function preencherCampos(){
    document.getElementById("texto_local").innerHTML=parametros.cidade+". "+parametros.estado+". "+parametros.pais;
    document.getElementById("texto_temperatura").innerHTML= parametros.temperatura+" º";
    document.getElementById("texto_clima").innerHTML=String(parametros.clima);
    document.getElementById("icone_clima").style.backgroundImage="url('"+parametros.icone+"')";
   // console.log(parametros);
  

  } 










 function previsaoCincoDias(localCode){
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange= function(){
  if(this.readyState==4&& this.status==200){
    var d =JSON.parse(this.responseText);
    var nome;
    var iconeClima;

     document.getElementById("texto_max_min").innerHTML=String(d.DailyForecasts[0].Temperature.Minimum.Value +"º/"+d.DailyForecasts[0].Temperature.Maximum.Value+"º");

 

  for(let nome in d){
    var dias = d.DailyForecasts;
 
  }

 
  var elementoHTMLDia='';
  
    for(let a=0;a<5;a++){
      var iconNumber = dias[a].Day.Icon<=9?"0"+String(dias[a].Day.Icon):String(dias[a].Day.Icon);


      iconeClima="https://developer.accuweather.com/sites/default/files/"+iconNumber+"-s.png";
     let min =String(dias[a].Temperature.Minimum.Value);
     let max=String(dias[a].Temperature.Maximum.Value);
     let getDays= new Date(dias[a].Date).getDay();
    
    
    

   
      elementoHTMLDia+='<div class="day col">';
      elementoHTMLDia+=DiasSemana()[getDays];


 elementoHTMLDia+=' <div class="dayname">';



elementoHTMLDia+=' <div style="background-image: url('+ iconeClima+')" class="daily_weather_icon"></div>';

 elementoHTMLDia+='<div class="max_min_temp">';
 elementoHTMLDia+=' '+min+"/"+max;
 elementoHTMLDia+='         </div>';
 elementoHTMLDia+='         </div>';
 elementoHTMLDia+='         </div>';

    } 

    document.getElementById("info_5dias").innerHTML=elementoHTMLDia; 
    //console.log(dias);

}


}
xhttp.open("GET",habilitaCORS+"http://dataservice.accuweather.com/forecasts/v1/daily/5day/"+localCode+"?apikey="+accuweatherAPI+"&language=pt-br&metric=true");
xhttp.send();

  };

  function DiasSemana(p5dias){


     p5dias=["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
    
return p5dias;


  }



function gerargrafico(horas, temperaturas){
  Highcharts.chart('hourly_chart', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Temperatura Hora a Hora'
    },
    
    xAxis: {
        categories: horas
    },
    yAxis: {
        title: {
            text: 'Temperatura (°C)'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: false
            },
            enableMouseTracking: false
        }
    },
    series: [{
      showInLegend:false,
    
        data: temperaturas
    
    }]
});
}




function pegarPrevisaoHora(localCode){
  var horarios=[];
  var temperaturas=[];


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function(){
    if(this.readyState == 4 && this.status == 200){
var d = JSON.parse(this.responseText);

for(var a=0;a<12;a++){



var hora = new Date(d[a].DateTime).getHours();
horarios.push(String(hora)+"h");
//console.log(horarios);
temperaturas.push(d[a].Temperature.Value);
gerargrafico(horarios,temperaturas);


}






    }

  



    
  }
 

 
  xhttp.open("GET", "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+localCode+"?apikey="+accuweatherAPI+"&language=pt-br&metric=true", true);
  xhttp.send();
} 


function pegarCoodenadasPesquisa(input){
  input=encodeURI(input);
  var cidade =[];


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function(){
    if(this.readyState == 4 && this.status == 200){
var d = JSON.parse(this.responseText);
var long = d.features[0].geometry.coordinates[0];
var lat = d.features[0].geometry.coordinates[1];
pegarLocalUsuario(lat,long);
cidade=d.features[0].place_name.split(',');
console.log(cidade);

parametros.cidade=cidade[0];
parametros.estado=cidade[1];
parametros.pais=cidade[2];






    }

  



    
  }
 

 
  xhttp.open("GET", "https://api.mapbox.com/geocoding/v5/mapbox.places/"+input+".json?access_token="+mapboxToken, true);
  xhttp.send();
} 




//pegarCoordenadasDoIP();


document.getElementById("search-button").onclick= function(){
  var local=  document.getElementById("local").value;


  if(local){
    pegarCoodenadasPesquisa(local);



  }else{
    alert('local Inválido');

  
  }


}

document.getElementById("local").onkeypress= function(e){

  if(e.which==13){

   
  var local=  document.getElementById("local").value;


    if(local){
      pegarCoodenadasPesquisa(local);
  
  
  
    }else{
      alert('local Inválido');
  
    
    } 

  }



}



});

