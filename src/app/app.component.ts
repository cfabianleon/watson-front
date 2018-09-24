import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  imagen: File;
  public resultados;
  resultado;
  resultado2;
  resultado3;
  img;






  constructor(public http: HttpClient) {}

  seleccionImagen( archivo: File){
    console.log(archivo);
    if (!archivo){
      this.imagen = null;
      return;
    }
    this.imagen = archivo;
  }

  genero(dato){
    if(dato === 'MALE'){
      return "Masculino"
    }else{
      return "Femenino"
    }
  }

  


  subirImagen(imagen: File) {
    return new Promise((resolve, reject) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append("image", imagen, imagen.name);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("Imagen subida");
            resolve(xhr.response);
          } else {
            console.log("Fallo la subida");
            reject(xhr.response);
          }
        }
      };
      let url = "http://localhost:3000/vrecognition";
      xhr.open('POST',url, true);
      xhr.send(formData);
    });
  }

  traerImagen(){
    let url = `http://localhost:3000/imagenes/imagen/${this.img}`;
    return url;
    
  }

  cambiarImagen() {
    this.subirImagen(this.imagen)
      .then((resp:any) => {
        this.resultados = JSON.parse(resp);
        this.resultado = this.resultados.modelo_1.images[0].classifiers[0].classes;
        this.resultado2 = this.resultados.modelo_2.images[0].faces;
        this.img = this.resultados.modelo_1.images[0].image;
        console.log(this.resultado2);
        this.traerImagen();
      })
      .catch(resp => {
        console.log(resp);
      });
  }
}
