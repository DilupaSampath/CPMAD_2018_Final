import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Nav, IonicPage, Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { PropertyListPage } from '../property-list/property-list';
import { AngularFireDatabase } from 'angularfire2/database';
import { ChatPage } from '../chat/chat';
import { EditPage } from '../edit/edit';
import { PropertyService } from '../../app/providers/property-service-mock';
import { AppoinmentsPage } from '../appoinments/appoinments';
import { ExamsPage } from '../exams/exams';
export interface MenuItem {
  title: string;
  component: any;
  icon: string;
}
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})

export class WelcomePage {
  // private noteListRef = this.db.list<any>('Workers/asd');
  properties: any[];
  chats: any[];
  chatsUser: any[];
  page = 'PropertyListPage';
  userType: any;
  userEmail; string;
  Subscription;
  
  // workers1: any=
  //     {
  //         "name":'XXXXXX',
  //         "url":'/../XXXXX/androidicon/rawable-hdpi-icon.png'
  //     };
  managements: any[] = [
    {
      "name": 'Student',
       "url": "http://downloadicons.net/sites/default/files/staff-icons-27681.png",
       "page":"student"
    },
    {
      "name": "Fee",
      "url": "http://downloadicons.net/sites/default/files/staff-icons-27681.png",
      "page":"fee"
    },
    {
      "name": "Exam",
      "url": "http://downloadicons.net/sites/default/files/staff-icons-27681.png",
      "page":"exam"
    },
    {
      "name": "SMS",
      "url": "http://downloadicons.net/sites/default/files/staff-icons-27681.png",
      "page":"SMS"
    },
    {
      "name": "Staff",
      "url": "http://downloadicons.net/sites/default/files/staff-icons-27681.png",
      "page":"staff"
    },
    {
      "name": "Expences",
      "url": "http://downloadicons.net/sites/default/files/staff-icons-27681.png",
      "page":"expences"
    }
  ];
  @ViewChild(Nav) nav: Nav;
  appMenuItems: Array<MenuItem>;
  property:any[]=[];
  accountMenuItems: Array<MenuItem>;
  Likecount=0;
  UnLikecount=0;
  helpMenuItems: Array<MenuItem>;
  selectedMessage:string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, private aFauth: AngularFireAuth,
    private toastCtrl: ToastController, private db: AngularFireDatabase, public events: Events) {
     
    
    this.appMenuItems = [
      { title: 'Home', component: WelcomePage, icon: 'home' },
      { title: 'Workers', component: PropertyListPage, icon: 'people' }
    ];

    this.accountMenuItems = [
      { title: 'My Account', component: EditPage, icon: 'ios-contact' },
      { title: 'Logout', component: WelcomePage, icon: 'log-out' },
    ];

    this.helpMenuItems = [
      { title: 'Welcome', component: WelcomePage, icon: 'bookmark' }
    ];

    this.userType = navParams.get('type');
    this.userEmail = navParams.get('uName');
    if(this.userType=="Staff"){
      
      // this.setProperty();
    }
    console.log("logged as --> " + JSON.stringify(this.userType));
    console.log("logged as --> " + JSON.stringify(this.userEmail));
// this.service.tempWorkerId=this.userEmail;

    events.subscribe('user:created', (data: any) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome---> ' + JSON.stringify(data));
    });


  }
  setProperty(){
    let tempId;

    this.db.list('/Workers/asd').subscribe(data => {
      this.property = data;
     
      for(let item of this.property){
      if(item.email==this.userEmail){
        console.log("this.property");
        console.log(item); 
        tempId=item['id'];
        this.property=item;
      }
        
       
        
      }


      console.log("emp id is --> "+tempId);
      this.db.object('/likes/'+tempId).subscribe( data => {
        console.log(data['likes']);
        this.Likecount = data.likes;
        
        console.log(this.Likecount);
      });
      this.db.object('/unlikes/'+tempId).subscribe( data => {
        console.log(data['unlikes']);
  
        this.UnLikecount = data.unlikes;
       
        if(this.UnLikecount<=0){
            this.UnLikecount=0;
        }
        console.log(this.UnLikecount);
      }); 
    });
   

  }
  ionViewDidLoad() {
    // this.addNote(); 
this.getChats();
    this.aFauth.auth.onAuthStateChanged((user) => {
      console.log("user--> " + JSON.stringify(user));
      if (user && user.email && user.uid) {
        this.presentToast( 'Hi.. '+user.email+ ' Welcome to  Smart Class');


      } else {
        // User is not logged in, redirect to where you need to.
        this.presentToast(' Could not find authentication details for '+user.email) ;
      }
    });

  }

  getData() {
    console.log("working");

  }
  openPage(page:string) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(this.page);
    console.log("before push --> " + this.userEmail);
    
    console.log("before push --> " + this.userType);
    if(page=='Student'){
    this.navCtrl.push(PropertyListPage, { userEmail: this.userEmail, userType: this.userType });
  }
  console.log("page " + page);
  if(page=='Exam'){
    
    this.navCtrl.push(ExamsPage, { userEmail: this.userEmail, userType: this.userType });
  }
  
  }
  
  getChats() {
    
    console.log("send email in welcome page --> " + this.userEmail);
    this.Subscription = this.db.list('/chat/' + this.userEmail.replace(/[^a-zA-Z 0-9]+/g, '')).subscribe(data => {
      this.chats = data;
      for(let item of this.chats){
        console.log([item].length);
      }
    });
  }
  //    addNote() {
  //        return this.noteListRef.push(this.workers1);
  //    }
  chatWorker(myTag){
    console.log(myTag );
    this.navCtrl.push(ChatPage, {
      chatItem: '',
      username: myTag,
      toId:this.userEmail,
      userType:'Worker'
  }
  );
  // this.db.object('/chat/'+this.userEmail.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ myTag.replace(/[^a-zA-Z 0-9]+/g,'')).set({
  //   messageType:"read"
  // })
  }
  appoinmentPage(){
    console.log("from welcome-->"+this.userEmail);
    this.navCtrl.push(AppoinmentsPage, {
      loginUser:"",
      toId:this.userEmail,
      userType:this.userType
  }
  );
  }

  chatUser(myTag:string){
    this.navCtrl.push(ChatPage, {
      chatItem: '',
      username: myTag,
      toId:this.userEmail,
      userType:'User'
  }
  );
  }


  presentToast(message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
editPage(property:any){
  this.navCtrl.push(EditPage, property);
}

}
