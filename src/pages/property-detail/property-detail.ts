import { Component } from '@angular/core';
import { ActionSheetController, ActionSheet, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { PropertyService } from '../../app/providers/property-service-mock';
import { ChatPage } from '../chat/chat';

@Component({
    selector: 'page-property-detail',
    templateUrl: 'property-detail.html',
    providers:[PropertyService]
})
export class PropertyDetailPage {
    noteListRef: any;
    noteListRefAll: any;
    property: any;
    _Id: string;
    username: string;
    message: string = '';
    Subscription;
    messages: object[] = [];
    userEmail:string;
    Likecount=0;
    likeStatus='';
    unlikeStatus='';
    UnLikecount=0;
    madeAppoinment=false;
    constructor(private alertCtrl: AlertController,private afd: AngularFireDatabase, private db: AngularFireDatabase, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public propertyService: PropertyService, public toastCtrl: ToastController) {
        
        
        this.madeAppoinment=false;
        this.property = this.navParams.data;
        console.log(this.property.contact);
     
        this.noteListRef = this.db.object('Workers/asd/');

            this.Subscription = this.db.list('/Workers/').subscribe( data => {
              this.noteListRefAll = data;
            });


        console.log("noteListRefAll 2st -->"+this.property.id);
        this.db.object('/likes/'+this.property.id).subscribe( data => {
            console.log(data['likes']);
            this.Likecount = data.likes;
            
            console.log(this.Likecount);
          });
          this.db.object('/unlikes/'+this.property.id).subscribe( data => {
            console.log(data['unlikes']);

            this.UnLikecount = data.unlikes;
           
            if(this.UnLikecount<=0){
                this.UnLikecount=0;
            }
            console.log(this.UnLikecount);
          });

    }
    ionViewDidLoad() {
        this.madeAppoinment=false;
    }
    
addLike(id:string){
    if(this.likeStatus != 'liked'){
let count=10;
if(this.Likecount==undefined){
    this.Likecount=0;
}
console.log("like added for id --> " +id);
        this.db.object('/likes/'+id).set({
            "id":id,
            "likes":(this.Likecount)+1
            
      });
      
    }
    this.likeStatus='liked';
}

addUnLike(id:string){
    if(this.unlikeStatus != 'unliked'){
    let count=10;
    if(this.UnLikecount==undefined){
        this.UnLikecount=0;
    }
    console.log("like added for id --> " +this.UnLikecount);
            this.db.object('/unlikes/'+id).set({
                "id":id,
                "unlikes":(this.UnLikecount)+1
          });
        }
     
        this.unlikeStatus='unliked';
    }
    
makeAppoinment(){
    console.log("user type cat --> "+'/appointments/'+this.property.email.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+ this.property.userType.replace(/[^a-zA-Z 0-9]+/g,''));
   
    this.db.object('/appointments/'+this.property.email.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+this.property.Uemail.replace(/[^a-zA-Z 0-9]+/g,'')).set({
        username: this.property.Uemail,
        message: "As we discus... i made an appoinment",
        status:"Pending"
      }).then( () => {
this.presentToast("You made appoinmet to "+this.property.email+". Thank you for using HelpHands. ");
this.madeAppoinment=true;      

// message is sent
      }).catch( () => {
        // some error. maybe firebase is unreachable  this.property.email
      });

      this.db.object('/appointmentsView/'+this.property.Uemail.replace(/[^a-zA-Z 0-9]+/g,'')+"/"+this.property.email.replace(/[^a-zA-Z 0-9]+/g,'')).set({
        username:this.property.email,
        status:"Pending"
      }).then( () => {
// message is sent
      }).catch( () => {
        // some error. maybe firebase is unreachable
      });



}
    chat() {
        console.log("sender-->"+ this.property.Uemail);
        console.log("reciver-->"+ this.property.email);
        this.navCtrl.push(ChatPage, {
            chatItem: this._Id,
            username: this.property.Uemail,
            toId:this.property.email,
            userType:this.property.userType
        }
        );


    }

    share(property) {
        let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Share via',
            buttons: [
                {
                    text: 'Twitter',
                    handler: () => console.log('share via twitter')
                },
                {
                    text: 'Facebook',
                    handler: () => console.log('share via facebook')
                },
                {
                    text: 'Email',
                    handler: () => console.log('share via email')
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => console.log('cancel share')
                }
            ]
        });

        actionSheet.present();
    }

    showAlert(title: string, message: string) {
        let alertBox = this.alertCtrl.create({
          title: title,
          subTitle: message,
          buttons: ['OK']
        });
        alertBox.present();
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

  changeBatch(sadds:any){
    let actionSheet2: ActionSheet = this.actionSheetCtrl.create({
        title: 'Change Batch',
        buttons: [
            {
                text: 'Batch 1',
                handler: () => console.log('batch1')
            },
            {
                text: 'Batch 2',
                handler: () => console.log('Batch')
            },
            {
                text: 'Batch 3',
                handler: () => console.log('Batch')
            },
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => console.log('cancel share')
            }
        ]
    });

    actionSheet2.present();

  }
  changeCourse(asd:any){
    let actionSheet1: ActionSheet = this.actionSheetCtrl.create({
        title: 'Change Course',
        buttons: [
            {
                text: 'Course 1',
                handler: () => console.log('Course')
            },
            {
                text: 'Course 2',
                handler: () => console.log('Course')
            },
            {
                text: 'Course 3',
                handler: () => console.log('Course')
            },
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => console.log('cancel Course')
            }
        ]
    });

    actionSheet1.present();

  }


}