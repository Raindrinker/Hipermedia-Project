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

Per tal de treballar amb el disseny de l'aplicació hem usat *Bootstrap*, concretament *bootstrap-material-design*, el qual ens permetía organitzar els layouts de tal forma que siguin responsive (s'adaptin a la mida del dispositiu). A més hem fet servir *Handlebars* per tal de crear templates i facilitar el canvi entre les diverses seccions de l'aplicació. Finalment fem servir el llenguatge *LESS* per tal de crear codi css de forma automàtica usant variables.

També, per al disseny de l'aplicació, hem usat una sidebar de codi obert preparada per ser responsive, i un slider que està adaptat per a *bootstrap-material-design*.

Per a la nostra aplicació hem usat primerament la API d'Spotify per tal d'accedir a la informació dels artistes, àlbums i cançons, així com per cercar la música dins l'aplicació.
També hem fet servir la API de Youtube, cercant la cançó que volem reproduir com a "[artista] - [canço]", suposant que el primer resultat d'aquesta cerca serà la cançó que volem reproduir.
A partir d'aquesta cerca obtindrem l'arxiu en format d'audio preparat per a reproduir.

Per la part de recomanació s'ha utilitzat Echonest. Al iniciar l'aplicació es comprova si tenim un Taste Profile id de Echonest guardat. En cas de no tenir-lo, se'n genera un i es guarda al localStorage. Totes les operacions que es facin sobre els favoritos actuaran sobre aquest taste profile (afegir i eliminar). A partir d'aquest perfil, quan volguem recomanacions acords als nostres gustos, serà únicament una crida a la API d'Echonest.

## Captures

![Principal1](https://i.gyazo.com/3d20e2f6195d99794cefe0c6374b41da.jpg)

![Principal2](https://i.gyazo.com/3dd004f4e80554baf0e9c99ba3ab75fa.jpg)

![Principal3](https://i.gyazo.com/a740c022feda49bc8e6bacfe41892337.png)

![AlbumLayout](https://i.gyazo.com/13631ac4b8d33019105dcf3b4f46c6ed.png)

![Playlist](https://i.gyazo.com/f48be2bec8aca0e0851cd8fe16ca4e92.png)

![Playing](https://i.gyazo.com/d1b8c3bbcdccffa475ed62f05201cc03.png)

<p style="float: left; width: 49%">
  <img src="https://i.gyazo.com/c511aa5c9285b7c0abf1ba0dc29eb7e4.png"/>
</p>
<p style="float: left; width: 2%">
</p>
<p style="float: left; width: 49%">
  <img src="https://i.gyazo.com/e5708d34235fd953c69c1b1f04a75207.png"/>
</p>


## Fonts consultades

* [Spotify Javascript Library](https://github.com/JMPerez/spotify-web-api-js)
* [Bootstrap](http://getbootstrap.com/)
* [Bootstrap Material Design](http://fezvrasta.github.io/bootstrap-material-design/)
* [Sidebar Template](http://startbootstrap.com/template-overviews/simple-sidebar/)
* [Handlebars](http://handlebarsjs.com/)
* [Less](http://lesscss.org/)
* [noUiSlider](http://refreshless.com/nouislider/)
