import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

/**
* Generated class for the ChatPage page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/
//@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  username: string = '';
  message: string = '';
  toId:string='';
  userType:string='';
  _chatSubscription;
  messages: object[] = [];

  constructor(public db: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {
      this.userType = this.navParams.get('userType');
      this.username = this.navParams.get('username');
      this.toId = this.navParams.get('toId');
      this.userType = this.navParams.get('userType');
console.log("user type cat --> "+'/chat/'+this.toId.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.username.replace(/[^a-zA-Z 0-9]+/g,''));
      this._chatSubscription = this.db.list('/chat/'+this.toId.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.username.replace(/[^a-zA-Z 0-9]+/g,'')).subscribe( data => {
        this.messages = data;
      });
    }

  
    sendMessage() {
      if(this.userType=="Worker"){
        this.db.list('/chat/'+this.toId.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.username.replace(/[^a-zA-Z 0-9]+/g,'')).push({
          username: this.toId,
          message: this.message
        }).then( () => {
          // message is sent
        }).catch( () => {
          // some error. maybe firebase is unreachable
        });
      }else{
            this.db.list('/chat/'+this.toId.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.username.replace(/[^a-zA-Z 0-9]+/g,'')).push({
              username: this.username,
              message: this.message
            }).then( () => {
              // message is sent
            }).catch( () => {
              // some error. maybe firebase is unreachable
            });
          }
            this.message = '';
          }
    ionViewDidLoad() {
      if(this.userType=="Worker"){
        this.db.list('/chat/'+this.toId.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.username.replace(/[^a-zA-Z 0-9]+/g,'')).push({
          specialMessage: true,
          message: `${this.toId} has joined the room`
        });

      }
      else
     { 
       this.db.list('/chat/'+this.toId.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.username.replace(/[^a-zA-Z 0-9]+/g,'')).push({
        specialMessage: true,
        message: `${this.username} has joined the room`
      });
    }
    }

    ionViewWillLeave(){
      if(this.userType=="Worker"){
        this._chatSubscription.unsubscribe();
        this.db.list('/chat/'+this.toId.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.username.replace(/[^a-zA-Z 0-9]+/g,'')).push({
          specialMessage: true,
          message: `${this.toId} has left the room`
        });

      }
      else

     {
        this._chatSubscription.unsubscribe();
      this.db.list('/chat/'+this.toId.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.username.replace(/[^a-zA-Z 0-9]+/g,'')).push({
        specialMessage: true,
        message: `${this.username} has left the room`
      });
    }
    }
  }
