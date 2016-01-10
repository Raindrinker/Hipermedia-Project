# Hipermedia-Project
Projecte d'aplicació web per a la Universitat.

## Descripció

L'objectiu d'aquesta pràctica era crear una web que ens permetés administrar les nostres cançons i ens en recomani de noves, a més de poder reproduirles.

Així doncs, l'aplicació ens permetrà:
* Cercar cançons, artistes i àlbums.
* Crear i eliminar llistes de reproducció.
* Recomanar cançons segons el nostre perfil.
* Guardar un seguit d'artistes, àlbums i cançons dins l'apartat "Favourites".
* Reproduir les cançons.

Per tal de treballar amb el disseny de l'aplicació hem usat "bootstrap", concretament "bootstrap-material-design", el qual ens permetía organitzar els layouts de tal forma que siguin responsive (s'adaptin a la mida del dispositiu). A més hem fet servir "handlebars" per tal de crear themeplates i facilitar el canvi entre les diverses "pantalles" de l'aplicació. Finalment fem servir el llenguatge "less" per tal de crear codi css de forma automàtica usant variables.
També, per al disseny de l'aplicació, hem usat una sidebar de codi obert preparada per ser responsive i un slider que està adaptat per a "bootstrap-material-design".

Per a la nostra aplicació hem usat primerament la API d'Spotify per tal d'accedir a la informació dels artistes, àlbums i cançons, així com per cercar la música dins l'aplicació.
També hem fet servir la API de Youtube, cercant la canço que volem reproduir com a "[artista] - [canço]", suposant que el primer resultat d'aquesta cerca serà la canço que volem reproduir.
A partir d'aquesta cerca obtindrém l'arxiu en format d'audio preparat pèr a reproduir.

{EXPLICACIÓ DE LA PART DE RECOMANACIÓ}

## Captures



## Seccions

* Recomanacions
* Favoritos
* Playlists


## Consultades



### Reproductor

* http://www.w3schools.com/html/html5_audio.asp
