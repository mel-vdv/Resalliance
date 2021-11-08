
'use strict';
const app = require('express')();
const http = require('http').Server(app);


const serveurIo = require('socket.io')(http, {
    cors: {
        origin: "*",
        "Access-Control-Allow-Origin": "*"
    }
});

const port = process.env.PORT || 5678;
const MongoClient = require('mongodb').MongoClient;
const urldb = "mongodb://127.0.0.1:27017";
//const urldb = process.env.MONGODB_URI;
const session = require('express-session');

const nodemailer = require('nodemailer');

app.use(session({
    secret: 'secretpasswordblog',
    resave: false,
    saveUninitialized: true
}));
let datas = {};
app.use((req, res, next) => {
    datas = app.locals;
    app.locals = {};
    datas.session = req.session;
    next();
})
//********************************************************** */
serveurIo.on("connection", socket => {
    console.log("connexion socket");
    /////////////

    ///////////////////////////////////////////// chargement des informations //////////////////////////////////////////////////////////////////////
    //********************************************************* */
    socket.on("infoGenerales", persConnect => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: persConnect }).toArray((er, data) => {
                let infos = data[0];
                socket.emit("infoGeneralesS", infos);
            });
        });
    });
    //********************************************************* */
    socket.on("infoGeneralesMembre", membre => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: membre }).toArray((er, data) => {
                let infoObjet = data[0];
                socket.emit("infoGeneralesMembreS", infoObjet);
            });
        });
    });
    //************************************************************** */
    socket.on("infoGeneralesAmis", arrayPseudo => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');

            coll.find({ pseudo: { $in: arrayPseudo } }).toArray((er, data) => {
                let arrayDeObjets = data;
                socket.emit("infoGeneralesAmisS", arrayDeObjets);
            });
        });
    }); //************************************************************************ */
    socket.on('amis', quiEstCo => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: quiEstCo }, { _id: 0, confirmes: 1 }).toArray((e, d) => {
                if(d[0]){
                    const arrayAmis = d[0].confirmes;
                socket.emit('amisS', arrayAmis);
                MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
                    const coll = cli.db('reseausocial').collection('profils');
                    coll.find({ pseudo: { $in: arrayAmis } }).toArray((e, d) => {
                        let list = d;
                        socket.emit('amisSbis', list);
                    });
                }); 
                }
                else{
                    console.log('zero ami');
                }
               
            });
        });
    });
    //*********************************************************** */
    socket.on('tousMembres', quiEstCo => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: { $ne: quiEstCo } }, { pseudo: 1, _id: 0 }).toArray((e, d) => {
                let tabObjets = d;
                socket.emit('tousMembresS', tabObjets);
            });
        });
    });

    //************************************************************** */

    socket.on("autresMembres", quiestco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: quiestco }, { confirmes: 1 }).toArray((er, d) => {
                if(d.length>0){
                let array = d[0].confirmes;
                MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
                    const coll = cli.db('reseausocial').collection('profils');
                    coll.find({ $and: [{ pseudo: { $nin: array } }, { pseudo: { $ne: quiestco } }] }).toArray((e, d) => {
                        let list = d;
                        socket.emit('autresMembresS', list);

                        //  serveurIo.emit('miseAJourAutresMembres');
                    });
                });
                }
            });
        });
    })
    //**************************************************** */
    socket.on("profil", profil => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: profil }).toArray((er, data) => {
                const profilS = JSON.stringify(data[0]);
                socket.emit('profilS', profilS);
            });
        });
    }); //******************************** */  
    socket.on("quelNiveau", pseudo => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: pseudo }, { niveau: 1, _id: 0 }).toArray((e, d) => {
                const niv = d[0].niveau;
                console.log('le niveau est ' + d[0].niveau);
                socket.emit("quelNiveauS", niv);
            });
        });
    });
    /////////////////////////////////////////// inscr - connexion - deco ///////////////////////////////////////////////////////
    //************************************************************************* */
    socket.on('inscr', inscr => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.insertOne(inscr);
        });
        socket.emit("inscrS", inscr);
        serveurIo.emit("majStat");
    });//********************************************************************* */
    socket.on('controlePseudo', pseudoX => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: pseudoX }).toArray((e, d) => {
                let pseudoDejaPris;
                if (d.length > 0) {
                    pseudoDejaPris = true;
                }
                else {
                    pseudoDejaPris = false;
                }
                socket.emit("controlePseudoS", pseudoDejaPris);
            });
        });

    });//********************************************************************* */

    socket.on('connexF', connexF => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: connexF.pseudo, mdp: connexF.mdp }).toArray((e, d) => {
                if (d.length) {
                    const authData = d[0];
                    MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
                        const coll = cli.db('reseausocial').collection('profils');
                        coll.updateOne({ pseudo: connexF.pseudo }, { $set: { statut: "connect" } });
                        coll.updateOne({ pseudo: connexF.pseudo }, { $push: { co: connexF.date } });
                        socket.emit('okConnexF', authData);
                    });
                }
                else { socket.emit('errorConnexF', ''); }
            });
        });
    }); //********************************************************************** */
    socket.on('codeco', codeco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: codeco.pseudo }, { $set: { niveau: codeco.niveau, statut: codeco.statut, chatEnCours: [], invitePar: [], demandeA: [] } });
            coll.updateMany({}, { $pull: { chatEnCours: codeco.pseudo } });
            coll.updateMany({}, { $pull: { invitePar: codeco.pseudo } });
            coll.updateMany({}, { $pull: { demandeA: codeco.pseudo } });
            //serveurIo.emit('maj');
            serveurIo.emit('miseAJourChat');
            serveurIo.emit('majStat');
        });
    });

    //////////////////////////////////////////////////// actions /////////////////////////////////////////////////////////////////////////
    // les messages publics:
    //*********************************************************** */
    socket.on("publier", publier => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: publier.pseudo }, { $push: { msgPublics: { auteur: publier.auteur, contenu: publier.contenu, rep: [] } } })
            socket.emit("publierS");
        });
    });
    //*************************************************************** */
    socket.on("repondreCom", rep => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: rep.page, "msgPublics.auteur": rep.auteur, "msgPublics.contenu": rep.contenu },
                {
                    $push:
                    {
                        'msgPublics.$.rep':
                            { 'auteurRep': rep.auteurRep, 'contenuRep': rep.contenuRep }
                    }
                });
            socket.emit('repondreComS');
            //serveurIo.emit('miseAJourAutresMembres');
        });
    });

    //******************************************************************** */
    socket.on("supprCommentaire", lequel => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: lequel.qui },
                { $pull: { msgPublics: { auteur: lequel.auteur, contenu: lequel.contenu } } });
            socket.emit('supprCommentaireS');
        });
    });  //****************************************************************** */
    socket.on("supprRepCom", rep => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: rep.page, "msgPublics.auteur": rep.auteur, "msgPublics.contenu": rep.contenu }, {
                $pull: {
                    'msgPublics.$.rep': {
                        auteurRep: rep.auteurRep, contenuRep: rep.contenuRep
                    }
                }
            });
            socket.emit('supprRepComS');
        });
    });

    // gestions demande d'amis:
    //******************************** */   
    socket.on("recommander", trio => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('recommandations');
            coll.insertOne({ recommande: trio.recommande, recommandeur: trio.recommandeur, destinataire: trio.destinataire });
            // et envoi de email de confirmation!!!! 
            socket.emit("recommanderS", trio);
        });
    });
    //********************************************************************** */
    socket.on('nbRecom', quiestco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('recommandations');
            coll.find({ destinataire: quiestco }).toArray((e, d) => {
                let nb = d.length;
                socket.emit('nbRecomS', nb);
            });

        });
    });
    //************************************************************************ */
    socket.on("ajouterAmi", (ajouterAmi) => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: ajouterAmi.a }, { $push: { demandeurs: ajouterAmi.de } });
            coll.updateOne({ pseudo: ajouterAmi.de }, { $push: { receveurs: ajouterAmi.a } });
            //socket.emit('ajouterAmiS');
            serveurIo.emit('miseAJourAutresMembres');

        });
    });
    //******************************** */
    socket.on("demandeRefusee", demandeRefusee => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: demandeRefusee.de }, { $pull: { receveurs: demandeRefusee.a } });
            coll.updateOne({ pseudo: demandeRefusee.a }, { $pull: { demandeurs: demandeRefusee.de } });
            //socket.emit("demandeRefuseeS");
            serveurIo.emit('miseAJourAutresMembres');
        });
    });

    //******************************** */
    socket.on("demandeAcceptee", demandeAcceptee => {
        console.log(demandeAcceptee);
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: demandeAcceptee.de }, { $pull: { receveurs: demandeAcceptee.a } });
            coll.updateOne({ pseudo: demandeAcceptee.a }, { $pull: { demandeurs: demandeAcceptee.de } });
            coll.updateOne({ pseudo: demandeAcceptee.de }, { $push: { confirmes: demandeAcceptee.a } });
            coll.updateOne({ pseudo: demandeAcceptee.a }, { $push: { confirmes: demandeAcceptee.de } });
            // socket.emit("demandeAccepteeS");
            serveurIo.emit('miseAJourAutresMembres');
        });
    });
    //***************************************************** */
    socket.on("retirerDeListe", duo => {
        console.log('serveur: retirer de la liste: ' + duo.quiEstCo + ' et ' + duo.membreclik);
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: duo.quiEstCo }, { $pull: { confirmes: duo.membreclik } });
            coll.updateOne({ pseudo: duo.membreclik }, { $pull: { confirmes: duo.quiEstCo } });
            MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
                const coll = cli.db('reseausocial').collection('profils');
                coll.find({ pseudo: duo.quiEstCo }, { confirmes: 1, _id: 0 }).toArray((e, d) => {
                    let liste = d[0].confirmes;
                    socket.emit("retirerDeListeS", liste);
                    //   serveurIo.emit('miseAJourAutresMembres');
                });
            });
        });
    });
    //******************************************************************** */
    socket.on('listeReco', destinataire => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('recommandations');
            coll.find({ destinataire: destinataire }).toArray((er, d) => {
                let listeReco = d;
                socket.emit("listeRecoS", listeReco);
            })
        });
    });
    //************************************************************************ */
    socket.on('ignorerReco', reco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('recommandations');
            coll.deleteOne({ destinataire: reco.destinataire, recommande: reco.recommande, recommandeur: reco.recommandeur });
            socket.emit("ignorerRecoS");

        });
    });
    //********************************************************************* */
    socket.on('controlePreReco', trio => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: trio.destinataire }, { confirmes: 1 }).toArray((e, d) => {
                let listAmis = d[0].confirmes;
                let reponse;
                if ((listAmis.find(x => x = trio.recommande)) === trio.recommande) {
                    reponse = false;
                    console.log('rep:' + reponse);
                }
                else {
                    reponse = true;
                    console.log('rep:' + reponse);
                }
                socket.emit('controlePreRecoS', reponse);

            });
        });
    });
    //////////////////////////////////////////////////////////////////////////////
    // la messagerie : 
    //************************************************************************* */  
    socket.on('chargerMessagerieNiv2', quiestco => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('conversations');
            coll.find({ participants: quiestco }).toArray((e, d) => {
                const liste = d;
                socket.emit('chargerMessagerieNiv2S', liste);
            });
        });
    });
    //************************************************************************* */  
    socket.on('chargerMessagerieNiv1', () => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('conversations');
            coll.find().toArray((e, d) => {
                const liste = d;
                socket.emit('chargerMessagerieNiv1S', liste);
            });
        });
    });

    //*************************************************** */
    socket.on('chargerDiscussionX', (them) => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('conversations');
            coll.find({ theme: them }).toArray((er, d) => {
                const objetX = d[0];
                socket.emit("chargerDiscussionXS", objetX);
            })
        });
    });
    //*************************************************** */
    socket.on('ecrire', ecrire => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('conversations');
            coll.updateOne({ theme: ecrire.theme }, {
                $push: {
                    contenu: {
                        auteur: ecrire.auteur
                        , msg: ecrire.msg
                    }
                }
            });
            socket.emit("ecrireS");
            serveurIo.emit('majDisc');
        })
    });
    //*************************************************** */
    socket.on('newDiscussion', newD => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('conversations');
            coll.insertOne({ createur: newD.createur, theme: newD.theme, participants: newD.participants });
            socket.emit('newDiscussionS');
            serveurIo.emit('majListDisc');
        })
    });  //***************************************** */
    socket.on('supprMsg', mess => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('conversations');
            coll.updateOne({ theme: mess.theme }, {
                $pull: { contenu: { auteur: mess.auteur, msg: mess.msg } }
            });
            serveurIo.emit('majDisc');
        });
    });
    //******************************************************** */
    socket.on('supprDisc', delet => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('conversations');
            coll.deleteOne({ createur: delet.createur, theme: delet.theme });
            serveurIo.emit('supprDiscS');
        });
    });
    // le chatt: //////////////////////////////////////////     CHAT    //////////////////////////////////////////////////////////////////////

    socket.on("chargerChat", quelConv => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('chatt');
            coll.find({ $and: [{ quiestco: quelConv.quiestco }, { interlocuteur: quelConv.interlocuteur }] }).toArray((e, d) => {
                if (d.length) {
                    let arrayConv = d[0].conv;
                    socket.emit("chargerChatS", arrayConv);
                } else {
                    let vide = "vide";
                    socket.emit("chargerChatS", vide);
                }
            });
        });
    });
    //****************************************************** */
    socket.on("debuterChat", reponse => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('chatt');
            coll.insertOne({
                quiestco: reponse.quiestco,
                interlocuteur: reponse.interlocuteur,
                conv: [
                    {
                        auteur: reponse.auteur,
                        date: reponse.date,
                        msg: reponse.msg
                    }
                ]
            });
            coll.insertOne({
                quiestco: reponse.interlocuteur,
                interlocuteur: reponse.quiestco,
                conv: [
                    {
                        auteur: reponse.auteur,
                        date: reponse.date,
                        msg: reponse.msg
                    }
                ]
            });

            socket.emit("repChatS");
            serveurIo.emit('maj');
        });
    });

    //****************************************************** */
    socket.on("repChat", reponse => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('chatt');
            coll.updateOne({ $and: [{ quiestco: reponse.quiestco }, { interlocuteur: reponse.interlocuteur }] },
                { $push: { conv: { auteur: reponse.auteur, date: reponse.date, msg: reponse.msg } } });
            coll.updateOne({ $and: [{ quiestco: reponse.interlocuteur }, { interlocuteur: reponse.quiestco }] },
                { $push: { conv: { auteur: reponse.auteur, date: reponse.date, msg: reponse.msg } } });

            socket.emit("repChatS");
            serveurIo.emit('maj');
        });
    });


    //****************************************************** */
    socket.on('proposeChat', chat => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: chat.quiEstCo }, { $push: { demandeA: chat.ami } });
            coll.updateOne({ pseudo: chat.ami }, { $push: { invitePar: chat.quiEstCo } });

            serveurIo.emit('miseAJourChat');
        });
    });
    //********************************* */
    socket.on("accepterChat", chat => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: chat.quiEstCo }, { $push: { chatEnCours: chat.ami } });
            coll.updateOne({ pseudo: chat.ami }, { $push: { chatEnCours: chat.quiEstCo } });
            coll.updateOne({ pseudo: chat.quiEstCo }, { $pull: { invitePar: chat.ami } });
            coll.updateOne({ pseudo: chat.ami }, { $pull: { demandeA: chat.quiEstCo } });
            serveurIo.emit('miseAJourChat');
        });

    });
    //***************************************** */
    socket.on("refuserChat", chat => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: chat.quiEstCo }, { $pull: { invitePar: chat.ami } });
            coll.updateOne({ pseudo: chat.ami }, { $pull: { demandeA: chat.quiEstCo } });
            serveurIo.emit('miseAJourChat');
        });

    });
    //********************************************** */
    socket.on("chatEnCours", quiEstCo => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: quiEstCo }, { chatEnCours: 1 }).toArray((er, d) => {
                let maj = d[0].chatEnCours;
                //  console.log('chat en cours :' + maj + ' , ' + maj.length);
                if (maj.length) {
                    socket.emit("chatEnCoursS", maj);
                }
                else {
                    console.log('pas de chat en cours ');
                }
            });
        });
    });
    //************************************************ */
    socket.on("enAttente", quiEstCo => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: quiEstCo }, { demandeA: 1 }).toArray((er, d) => {
                let maj = d[0].demandeA;
                if (maj[0]) {
                    socket.emit("enAttenteS", maj);
                }
            });
        });
    });
    //************************************************ */
    socket.on("invitePar", quiEstCo => {

        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: quiEstCo }, { invitePar: 1 }).toArray((er, d) => {
                let maj = d[0].invitePar;
                if (maj[0]) {
                    socket.emit("inviteParS", maj);
                }
            });
        });
    });
    //********************************************************************* */


    ////////////////////////////////// actions admin ////////////////////////////////////////
    //********************************************************************** */
    socket.on("editer", newUser => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: newUser.pseudo }, {
                $set: {
                    genre: newUser.genre,
                    mail: newUser.mail,
                    description: newUser.description,
                    tel: newUser.tel,
                    adresse: newUser.adresse,
                    cp: newUser.cp,
                    date: newUser.date,
                    ville: newUser.ville
                }
            });
        });
    });
    //******************************** */  
    socket.on("supprProfil", pseudoDelete => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.deleteOne({ pseudo: pseudoDelete });

            socket.emit("supprProfil");

        });
    });

    //*************************  COMPONENT : LES STAT DE ACCUEIL  ******************************************** */
    socket.on('accueil', () => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find().toArray((e, d) => {
                let nbTotal = d.length;
                socket.emit('accueilSnbTot', nbTotal);
            });
        });
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ statut: "connect" }).toArray((e, d) => {
                const accueilSMbCo = d.length;
                socket.emit('accueilSMbCo', accueilSMbCo);
            });
        });
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('conversations');
            coll.find({}).toArray((e, d) => {
                const accueilSmsg = d.length;
                socket.emit('accueilSmsg', accueilSmsg);
            });
        });
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('chat');
            coll.find({}).toArray((e, d) => {
                const accueilSChat = d.length;
                socket.emit('accueilSChat', accueilSChat);
            });
        });
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            let somme = 0;
            let i = 0;

            coll.find({}).toArray((e, d) => {

                while (d[i]) {

                    if (d[i].msgPublics) {
                        somme = somme + d[i].msgPublics.length;
                        i++;
                    }
                    else {
                        i++;
                    }
                }
                const accueilSCom = somme;
                socket.emit('accueilSCom', accueilSCom);
            });
        });

    });

    //******************************** */  
    socket.on("verifierLien", duo => {
        // console.log('les amis sont : ' + duo.personneConnect + ' et ' + duo.ami2);
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: duo.personneConnect }, { confirmes: 1, _id: 0 }).toArray((e, d) => {
                let listeAmis = d[0].confirmes;
                //   console.log('la liste confirmes: ' + listeAmis);
                //   console.log("sami?" + listeAmis.indexOf(duo.ami2));
                if (listeAmis.indexOf(duo.ami2) !== null && listeAmis.indexOf(duo.ami2) !== -1) {
                    //      console.log('ils sont amis');
                    socket.emit("verifierLienS", 1);
                }
                else {
                    console.log('ils ne sont pas amis');
                    MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
                        const coll = cli.db('reseausocial').collection('profils');
                        coll.find({ pseudo: duo.personneConnect }, { demandeurs: 1, _id: 0 }).toArray((e, d) => {
                            let listeDemandeurs = d[0].demandeurs;
                            // console.log('la liste demandeurs: ' + listeDemandeurs);
                            if (listeDemandeurs.indexOf(duo.ami2) !== null && listeDemandeurs.indexOf(duo.ami2) !== -1) {
                                // console.log('ami b est demandeur');
                                socket.emit("verifierLienS", 2);
                            }
                            else {
                                console.log('ami b non demandeur');
                                MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
                                    const coll = cli.db('reseausocial').collection('profils');
                                    coll.find({ pseudo: duo.personneConnect }, { receveurs: 1, _id: 0 }).toArray((e, d) => {
                                        let listeReceveurs = d[0].receveurs;
                                        console.log('la liste receveurs: ' + listeReceveurs);
                                        if (listeReceveurs.indexOf(duo.ami2) !== null && listeReceveurs.indexOf(duo.ami2) !== -1) {
                                            // console.log('ami b est receveur');
                                            socket.emit("verifierLienS", 3);
                                        }
                                        else {
                                            //  console.log('aucun lien');
                                            socket.emit("verifierLienS", 4)

                                        }
                                    });
                                });

                            }
                        });
                    });
                }
            });
        });
    });




    //******************************** */   
    socket.on("chercherPseudo", regex => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ $or: [{ pseudo: { $regex: regex } }, { prenom: { $regex: regex } }, { nom: { $regex: regex } }] }, { _id: 0, pseudo: 1, nom: 1, prenom: 1 }).toArray((e, d) => {
                let listeResult = [];
                if (d.length) {
                    for (let i = 0; i < d.length; i++) {
                        listeResult.push(d[i]);
                    }
                }
                else {
                    listeResult = "Aucun résulat de correspond à votre requête.";
                }
                socket.emit("chercherPseudoS", listeResult);
            });
        });
    });

    //****************  COMPONENT  : "mdp" *******************************************
    socket.on('mdpAleatoire', code => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {

            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ $and: [{ mail: code.mail }, { pseudo: code.pseudo }] }).toArray((e, d) => {
                if (d.length) {
                    socket.emit('mdpAleatoireS', 1);
                }
                else { // si mail et pseudo correspondent pas : 
                    socket.emit('mdpAleatoireS', 2);
                }
            });

        });
    });
    //***************************************** */
    socket.on('nouveauMdp', code => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.updateOne({ pseudo: code.pseudo }, { $set: { mdp: code.newMdp } });
            socket.emit("nouveauMdpS");
        });
    });
    //********************************************* */
    // gestion des mails ://////////////////////////////////////////////////////////////////////////////////////////////
    socket.on('trouverAdresseMail', membre => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ pseudo: membre }, { mail: 1, _id: 0 }).toArray((e, d) => {
                let adresseEmail = d[0].mail;
                console.log("adresse email est : " + adresseEmail);
                socket.emit("trouverAdresseMailS", adresseEmail);
            });
        });
    })
    //******************************** */  
    socket.on("envoiMail", message => {
        let transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
                user: 'melvdv123456@outlook.com',
                pass: 'm1e2l3v4d5v6'
            }
        });
        let msg = {
            from: ' "reseau resalliance" <melvdv123456@outlook.com>',
            to: message.to,
            subject: message.subject,
            text: message.text
        };
        transporter.sendMail(msg, function (error, info) {
            if (error) {
                console.log("error: " + error);
                return;
            }
            else {
                console.log('message sent');
            }
            transporter.close();
        });
    });
    //************************************************ */
    ////    photos de profil    **********************

    socket.on('chargerPhoto', membre => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('photos');
            coll.find({ pseudo: membre }).toArray((e, d) => {
                if (d.length) {
                    let x = {
                        image: d[0].image,
                        format: d[0].format
                    }

                    socket.emit("chargerPhotoS", x);
                }

            });
        });
    })
    //-----------------------------------------------

    socket.on('enregistrerPhoto', pseudoo => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('photos');
            coll.updateOne({ pseudo: 'testy' }, { $set: { pseudo: pseudoo } });
        });
    });
    //-------------------------------------------------  
    //-************************     ADMINISTRATEUR  *****************************************
    socket.on('adminConnexions', () => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({}, { pseudo: 1, prenom: 1, nom: 1, co: 1 }).toArray((e, d) => {
                let tabObjets = d;
                socket.emit('adminConnexionsS', tabObjets);
            });
        });
    });
    //------------------------------------------------------------------------
    socket.on('listComm', pseudo => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({ 'msgPublics.auteur': pseudo }, { pseudo: 1, msgPublics: 1 }).toArray((e, d) => {
                let tableauMurs = [];
                let tableauMP = [];
                for (let i = 0; i < d.length; i++) {
                    tableauMurs.push(d[i].pseudo);
                    let tri = (d[i].msgPublics).filter((e) => e.auteur === pseudo);

                    for (let y = 0; y < tri.length; y++) {
                        tableauMP.push(tri[y].contenu);

                    }
                }
                socket.emit('listCommS', tableauMP);
                socket.emit('listMurs', tableauMurs);
            });
        });
    });
    //-----------------------------------------------------------------/
    socket.on('supprimerUser', mb => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.deleteOne({ pseudo: mb });
            coll.updateMany({}, { $pull: { confirmes: mb, demandeurs: mb, receveurs: mb } });    // on delete de tous les tableaux d'amitié.
            socket.emit('supprimerUserS');
            serveurIo.emit('majAdmin');// on met à jour les stats de l'accueil.
            serveurIo.emit('');// on met à jour le tableau administrateur.
        });
    });
    //------------------------------------------------------------------------
    socket.on('verifAdmin', saisie => {
        MongoClient.connect(urldb, { UseUnifiedTopology: true }, (er, cli) => {
            const coll = cli.db('reseausocial').collection('profils');
            coll.find({$and: [{pseudo: saisie.pseudo}, {mdp: saisie.mdp}, {niveau:1}]}).toArray((e, d) => {
                let reponse; 
                if (d[0]) {
                    reponse = true;
                }
                else {
                    reponse = false;
                }
                socket.emit('verifAdminS', reponse);
            });
        });
    });

    ////////////////////////////////////////////////////////////////////
});
//************************************************************************** */
http.listen(port, () => {
    console.log(`port ${port} sur écoute`);
});
