import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { WelcomePage } from '../welcome/welcome';
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase/app';
import { Events } from 'ionic-angular';
/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  address:string;
  city:string;
  district:string;
  experience: string;
  id:string;
  name:string;
  phonenumber:string; 
  picture:string;
  tags:string;
  thumbnail:string;
  type:string;

  

  private noteListRef:any;
  staff: any;
user ={} as User;
userType='Staff';
togglestate=false;
IsStateChange=true;
  constructor(private aFauth:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams ,public alertCtrl: AlertController,
    private db: AngularFireDatabase,
    public events: Events) {
  
    this.IsStateChange=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.IsStateChange=true;
    // this.IsStateChange=true;
    // this.db.list('/user/_vguvqi14j').push({
    //   "id": "_vguvqi14j",
    //   "name":" user.email"
    //   // message: `${this.username} has joined the room`
    // });
  }
 register(user:User){

   
   let id=this.genarateUniqueId();
   

  console.log("register --> "+user.email);
   try{ 
    
    const result = this.aFauth.auth.createUserWithEmailAndPassword(user.email,user.password);
    if(this.userType=='Staff'){

      this.staff=
      {
        "id": id,
        "name": user.name,
        "email":user.email,
        "subject": user.address,	
        "phonenumber":user.phonenumber,
        "picture": "https://d30y9cdsu7xlg0.cloudfront.net/png/466667-200.png"
    };

    this.registerStaff(id);
    }else{
      this.db.list('/user/'+id).push({
        "id": id,
        "name": user.email
        // message: `${this.username} has joined the room`
      });
    }
    this.addUserToChatRoom(id,user.name);
    
    this.showAlert();
    this.navCtrl.setRoot(WelcomePage,{type:this.userType,uName:user.email});
   
   }
   catch(e){
    this.ErrorshowAlert(e.message);
     console.error(e.message);


     
   }


  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Registerd Successfully!',
      subTitle: 'Your registation was successfuly done with <strong style="color: orange"> HelpHands</strong>',
      buttons: ['OK']
    });
    alert.present();
  }
  ErrorshowAlert(message:string) {
    let alert = this.alertCtrl.create({
      title: '<strong style="color: red">Registation failed!<strong>',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  changeUserTpe(){
    console.log("toggle work");
    if(this.togglestate){
      this.IsStateChange=false;
      console.log("true work");
      this.userType='Staff';
    }else{
      console.log("false user");
      this.userType='Parent';
      this.IsStateChange=true;
    }
   
  }
  registerStaff(id:string) {
    this.noteListRef = this.db.object('Staff/'+id+'/');
    return this.noteListRef.set(this.staff);
}
addUserToChatRoom(id:string,name:string){
  this.db.list('/chatroom/'+id).push({
    specialMessage: true,
    // message: `${this.username} has joined the room`
  });

}
genarateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}


}
