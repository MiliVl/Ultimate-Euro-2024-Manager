Romana:

Aceasta aplicatie web a fost dezvoltata cu ajutorul mai multor tehnologii: 
-javascript
-CSS
-HTML
-node.js 
-react

Dependencies:
-baza de date este una locala, integrata in asa fel incat sa poata fi folosita si de pe un alt dispozitiv,
 in conditiile in care aceasta este adaugata in path-ul: C:\\Fotball-Manager-2024\\backend\\fotball_database.db
- Node.js
- npm
- React(toate Dependencies urile instalate in terminal sunt in package-lock.json)


Cum se porneste aplicatia:
-in terminal se scrie comanda: "npm start", iar serverul aplicatiei(de front-end) va fi disponibil 
la adresa: http://localhost:3000

Continut:
-pagina de start unde userul va alege dintre modurile de joc: "User vs Computer" si "Computer vs Computer"
-In cazul "User vs Computer", userul va fi redirectionat catre o pagina unde acesta va putea sa isi aleaga
 tara cu care doreste sa joace. Dupa ce tara este aleasa, acesta va fi redirectionat catre pagina unde ii 
 este prezentata tabla de joc pe care trebuie sa isi aleaga jucatorii. Fiecare jucator dispune de o descriere 
 care va ajuta playerul sa faca alegerea. Dupa ce toata echipa este formata, userul este redirectionat catre 
 "knockout stage", unde va putea vedea ce echipa castiga in fiecare runda si statusul echipei alese. Echipa 
 castigatoare din fiecare runda este aleasa in functie de media echipei in functie de scorul jucatorilor alesi.
 Restul echipelor sunt formate random si ordinea lor in meciuri este tot random.
-In cazul "Computer vs Computer" toate echipele sunt formate random si alese intr o ordine random. 
-Dupa finalizarea meciurilor, butonul de "Proceed to next match" este dezactivat, iar userul se poate
 intoarce la pagina de start. 

Pentru a vedea baza de date:
-DB Browser (instalat)
-drag and drop al fisierului "fotball_database.db" in aplicatia DB Browser


----------------------------------------------------------------------------------------------------------------------


English:

This web application has been developed with the help of several technologies: 
-javascript
-CSS
-HTML
-node.js 
-react

Dependencies:
- the database is a local one, integrated in such a way that it can be used from another device. It should
be added to the path: C:Fotball-Manager-2024backendfotball_database.db
- Node.js
- npm
- React(all installed Dependencies in terminal are in package-lock.json)

How to start the app:
- in the terminal write the command: "npm start" and the application server (front-end) will be available 
at: http://localhost:3000

Content:
- the home page where the user will choose between the game modes: "User vs Computer" and "Computer vs Computer"
- In the case of "User vs Computer", the user will be redirected to a page where he will be able to choose
 the country he wants to play with. Once the country is chosen, they will be redirected to the page where they 
 will have to choose the players for the team. Each player has a description that will help the player make the choice.
 After the whole team is formed, the user is redirected to knockout stage, where he will be able to see which team
 wins in each round and the status of the chosen team. The winner of each round is chosen according to the team's 
 score formed of out of the average score of the chosen players. The rest of the teams are randomly formed and 
 their order in the matches is also random.
-In the case of "Computer vs Computer" all teams are randomly formed and chosen in a random order. 
-After the completion of the matches, the "Proceed to next match" button is deactivated, and the user can
return to the home page. 

To view the database:
-DB Browser (installed)
-drag and drop of the "fotball_database.db" file in the DB Browser application

