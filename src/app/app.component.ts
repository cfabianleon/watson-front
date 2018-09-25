import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

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
  carga;

  constructor(public http: HttpClient, private toastr: ToastrService) {}

  seleccionImagen(archivo: File) {
    console.log(archivo);
    if (!archivo) {
      this.imagen = null;
      return;
    }
    this.imagen = archivo;
  }

  genero(dato) {
    if (dato === "MALE") {
      return "Masculino";
    } else {
      return "Femenino";
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
            
            resolve(xhr.response);
          } else {
            console.log("Fallo la subida");
            reject(xhr.response);
          }
        }
      };
      let url = "https://proyecto-watson.herokuapp.com/vrecognition";
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  traerImagen() {
    let url = `https://proyecto-watson.herokuapp.com/imagenes/imagen/${
      this.img
    }`;
    return url;
  }

  cambiarImagen() {
    this.carga = true;

    this.subirImagen(this.imagen)
      .then((resp: any) => {
        this.resultados = JSON.parse(resp);
        this.resultado = this.resultados.modelo_1.images[0].classifiers[0].classes;
        this.resultado2 = this.resultados.modelo_2.images[0].faces;
        this.img = this.resultados.modelo_1.images[0].image;
        console.log(this.resultado);
        this.traerImagen();
        this.toastr.success("Imagen cargada", "Oli!");
        this.carga = false;
        console.log(this.carga);
      })
      .catch(resp => {
        this.toastr.error("Error en la carga", resp);
        console.log(resp);
      });
  }
}
