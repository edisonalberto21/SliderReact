import * as React from 'react';
import { ISliderProps } from './ISliderProps';
import { escape } from '@microsoft/sp-lodash-subset';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import { IAccesos } from './IAccesos';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import pnp, { sp, Item, ItemAddResult, ItemUpdateResult, Items, ConsoleListener } from "sp-pnp-js";  
import { IListItem } from './IListItem';
import { INoticiasState } from './INoticiasState'; 
import { AadHttpClient, MSGraphClient } from "@microsoft/sp-http";


export default class Test extends React.Component<ISliderProps, INoticiasState> {

  constructor(props: ISliderProps, state: INoticiasState) {                     //Se define el constructor
    super(props);
    this.state = {                                                                   //Estado inicial, array items vacio
      items: [],
      accesos: [],
      licencia: true
    };
    this.Slider();     
    this.Accesos();       
    this.datosiniciales()                                              //Se ejecuta el método de consulta
   }

   public _renderCurrencies(imgitem) {                                                       //Funcion para mostrar la imagen de la lista 
    var img = document.createElement('div');
    img.innerHTML = imgitem;
    return img.getElementsByTagName('img')[0].getAttribute("src");
}

private interna(id){

  window.location.href = this.props.siteUrl+"/Paginas/noticias.aspx?Buscar="+id;             //Abre una interna filtrada por la clase especificada
}
 
  public render(): React.ReactElement<ISliderProps> {
 
    //Down
    $('#down').click(function(){
      $('.principioa').animate({
        scrollTop: '150px'
      }, 200);
    })

    //Up
    $('#up').click(function(){
      $('.principioa').animate({
            scrollTop: '0px'
          }, 200);
        });
    
    const { Color = 'rgba(0,47,107,.84)' } = this.props;
    //Renderiza el slider, recibe el state del constructor
    const items: JSX.Element[] = this.state.items.map((item: IListItem, i: number): JSX.Element => {   //Recorre el primer elemeto del array, para mostrar la primera noticia
      var active = i===0 ? "active" : "";
      
     return (
      <div className={"carousel-item point" + " " + active} onClick={() => this.interna(item.Id)}>
        <img src={this._renderCurrencies(item.imagen)} className="d-block w-100" alt="..."/>
          <div className="carousel-caption" style={{background:Color}}>
            <h3 className="banner-title" style={{background:item.Categoria['Color']}}>{item.Categoria['Title']}</h3>
            <h4>{item.Title}</h4>
            <p>{item.Descripcion}</p>
          </div>
    </div>
     );
   });
    //Renderiza los elementos de control del slider
    const elementos: JSX.Element[] = this.state.items.map((item1: IListItem, index: number): JSX.Element => {   //Recorre el primer elemeto del array, para mostrar la primera noticia
      const limite = item1.Title.length < 34 ? item1.Title : item1.Title.substr(0,26) + '...'
      var active = index===0 ? "active" : "";
      
      return (
        <li data-target="#myCarousel" data-slide-to={index} className={"col-3" + " " + active}>
        <a href="#"><div className="card mb-3 ">
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src={this._renderCurrencies(item1.imagen)} className="card-img tumb-slid pl-2 pt-1 pb-1" alt="..."/>
              </div>
              <div className="col-md-8">
                <div className="card-body p-0 pl-2 pt-2">
                 <h5 className="card-title font-16 mb-0">{limite}</h5>
                </div>
                
              </div>
              <div className="card-footer p-0">
                  <h5 className="txtfotter font-16" style={{color:item1.Categoria['Color']}}>{item1.Categoria['Title']}</h5>
                </div>
            </div>
          </div></a>
      </li>
     );
   });
   //Render Accesos Inicio
   const accesos: JSX.Element[] = this.state.accesos.map((itemacceso: IAccesos, i: number): JSX.Element => {   //Recorre el primer elemeto del array, para mostrar la primera noticia
  
    var url = itemacceso.url  ? itemacceso.url['Url'] : '#';
    var url1 =  !this.state.licencia && itemacceso.Title == 'Correo Corporativo'  ? 'pasoen' : '';
    
   return (
      <div className={"col px-0 col-6 " + url1}><a href={url} className="btn btn-area text-white font-16 py-3 mb-1 font-weight-light acceso " style={{background:itemacceso.Color}}>
        <img className="icon-area" src={this._renderCurrencies(itemacceso.imagen)}/>
        <br/>{itemacceso.Title}<br/> 
     </a>
    </div>
   );
 });
   //Fin render Acceso

    return (
      <>
      <section className="Slide">
      <div className="row ml-0 mr-0">
        <div className="col-lg-9 col-xl-9 col-md-12 col-12 px-0"> 
          <div id="myCarousel" className="carousel slide banner-carga" data-ride="carousel">
            <div className="carousel-inner">
               {items}
              </div>
                 <ul id="navslider" className="nav nav-pills nav-justified no-gutters carousel-indicators">
                  {elementos}
                 </ul>
                </div> 
          </div>


        <div className="col-xl-3 col-lg-3 px-1 ">

            <div className="container">
                <div className="row row-cols-4 row-cols-sm-4 row-cols-md-2 principioa">
                  
                 {accesos}

                  </div>
                 <div>
                  <span className="flechaacce">
                  <i id="down" className="fas fa-angle-down itemac"></i>
                  <i id="up" className="fas fa-angle-up itemac itemap"></i>
                  </span> 
              </div> 
              </div>
        </div>

      </div>
      </section>
    </>
    );
  }

  private Slider(){     
    pnp.sp.web.lists.getByTitle('Noticias')
      .items.select('Descripcion,Title,id,imagen,Categoria/Title,Categoria/Color&$expand=Categoria').top(4).orderBy('Created', false).filter("Destacado eq '1'").get()    //selecciona los items de la lista 
      .then((items: IListItem[]): void => {
        this.setState({
          items: items
        }); 
    }, (error: any): void => {        //Imprime si existe el error
      console.log(error);
       });
      
  }

  private Accesos(){
    pnp.sp.web.lists.getByTitle('Accesos')
      .items.select('Title,imagen,Color,url,Orden').orderBy('Orden', true).get()    //selecciona los items de la lista 
      .then((items: IAccesos[]): void => {
        this.setState({
          accesos: items
        }); 
    }, (error: any): void => {        //Imprime si existe el error
      console.log(error);
       });
      
  }

  private datosiniciales() {
    this.props.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient) => {
          client
            .api("me")
            .version("v1.0")
            .select("assignedLicenses")
            .get((err, res) => {  
              if(res.assignedLicenses.length < 1){
                this.setState({
                  licencia: false
                }); 
              }
            /*  console.log(res.assignedLicenses.length)
                if(res){
                  licencia.push(res.assignedLicenses);
                }*/
                              // Campo remitente
                    //Lo asigna virtualmente para consultarlo posteriormente
             
            });
           
        });
      }
   

}
