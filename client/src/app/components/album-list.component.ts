import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album';


@Component({
    selector: 'album-list',
    templateUrl: '../views/album-list.html',
    providers: [
        UserService,
        AlbumService,
    ]
})

export class AlbumListComponent implements OnInit {
    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public confirmado;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Lista de Albumes';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('album-list.component.ts cargado');
        //Llamar al metodo del api para sacar un algum en base
        //Conseguir el album y mostrarlo en el formulario
        this.getAlbums();
    }

    getAlbums() {

        this._albumService.getAlbums(this.token, null).subscribe(
            response => {

                if (!response.albums) {
                    this._router.navigate(['/']);
                } else {
                    console.log(response.albums);
                    
                    this.album = response.albums;
                }
            },
            error => {
                //cuando recibimos un error, lo recibimos diferente a cuando recibimos un status200 que es un json usable. en este caso vamos a parsear a json el error para poder usar correctamente el mensaje del error y mostrarlo en la alerta
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    var body = JSON.parse(error._body);

                    this.alertMessage = body.message;
                    console.log(error);
                }
            }
        )
    }

    onDeleteConfirm(id) {
        this.confirmado = id;
    }

    onCancelAlbum(){
        this.confirmado = null;
    }

    onDeleteAlbum(id){
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if(!response.album){
                    alert('Error en el servidor');
                }
                
                this.getAlbums();
            },
            error => {
                //cuando recibimos un error, lo recibimos diferente a cuando recibimos un status200 que es un json usable. en este caso vamos a parsear a json el error para poder usar correctamente el mensaje del error y mostrarlo en la alerta
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    var body = JSON.parse(error._body);

                    this.alertMessage = body.message;
                    console.log(error);
                }
            }
        )
    }

    onSubmit() {
        //para recibir todos los parametros que son enviados por url
        // this._route.params.forEach((params: Params) => {
        //     let id = params['id'];// recibimos este id para luego pasarlo al api y saber que artista estoy editando

        //     this._albumService.editAlbum(this.token, id, this.album).subscribe(
        //         response => {

        //             if (!response.album) {
        //                 this.alertMessage = 'Error en el servidor';
        //             } else {
        //                 this.alertMessage = 'El album se ha actualizado correctamente!';

        //                 //Subir la imagen del album
        //                 if (!this.filesToUpload) {
        //                     //Redirigirme
        //                     this._router.navigate(['/artista', response.album.artist]); //redirecciono a la pag de artista con el response.album.artist obtengo el id del artista cuyo album que estoy editando
        //                 } else {
        //                     //si si tengo imagen para subir
        //                     this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image').then(
        //                         (result) => {//si si tengo foto entonces la subo e igual me voy a esa pagina de artista con el response.album.artist obtengo el id del artista cuyo album que estoy editando
        //                             this._router.navigate(['/artista', response.album.artist]);
        //                         },
        //                         (error) => {
        //                             console.log(error);
        //                         }
        //                     );
        //                     //this.artist = response.artist;
        //                     // this._router.navigate(['/editar-artista'], response.artist._id);
        //                 }
        //             }
        //         },
        //         error => {
        //             //cuando recibimos un error, lo recibimos diferente a cuando recibimos un status200 que es un json usable. en este caso vamos a parsear a json el error para poder usar correctamente el mensaje del error y mostrarlo en la alerta
        //             var errorMessage = <any>error;

        //             if (errorMessage != null) {
        //                 var body = JSON.parse(error._body);

        //                 this.alertMessage = body.message;
        //                 console.log(error);
        //             }
        //         }
        //     )
        // });

    }

}