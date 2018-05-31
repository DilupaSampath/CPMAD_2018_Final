import { Component } from '@angular/core';
import { Config, NavController, NavParams, AlertController } from 'ionic-angular';

import { PropertyDetailPage } from '../property-detail/property-detail';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user';
import { Student } from '../../models/student';
import { Observable } from 'rxjs';
import { PropertyService } from '../../app/providers/property-service-rest';

@Component({
  selector: 'page-property-list',
  templateUrl: 'property-list.html'
})
export class PropertyListPage {
  user: User;
  student: Student;
  studentReg: any;
  userEmail: string;
  properties: any[];
  tempProperties: any[];
  searchKey: string = "";
  viewMode: string = "list";
  map;
  markersGroup;
  Subscription;
  private noteListRef: any;
  userType: string = '';
  id: string;
  address: string;
  name: string;
  email: string;
  course: string;
  phonenumber: string;
  currnetYear: string;
  batch: string;

  ubscription = this.db.list('/chat').subscribe(data => {
    this.noteListRef = data;
  });

  constructor(public alertCtrl: AlertController,public navParams: NavParams, private afd: AngularFireDatabase, public navCtrl: NavController, public service: PropertyService, public config: Config, private db: AngularFireDatabase) {
    this.findAll();
    // // this.userEmail = navParams.get('userEmail');
    // // this.userType = navParams.get('userType');
    // console.log("logged as --> " + this.userEmail);
  }

  // openPropertyDetail(property: any) {
  //   // property.Uemail = this.userEmail;
  //   // property.userType =this.userType;
  //   // console.log(property);
  //   // this.navCtrl.push(PropertyDetailPage, property);

  // }

  onInput(event) {
    console.log("input");
    if (this.searchKey == '' || this.searchKey == null || this.searchKey == undefined) {
      this.findAll();
    }
    else {
      this.searchHelp(this.searchKey)
        .then((data: any[]) => {
          this.properties = data;
          console.log(this.properties);
        })
        .catch(error => alert(JSON.stringify(error)));
    }
  }
  searchHelp(searckKey: string) {
    console.log("my key --> " + searckKey);
    if (searckKey == '' || searckKey == null || searckKey == undefined) {
      this.findAll();

    } else {
      let key: string = searckKey.toUpperCase();
      return Promise.resolve(this.properties.filter((property: any) =>
        (property.name + ' ' + property.phonenumber + ' ' + property.city + ' ' + property.type).toUpperCase().indexOf(key) > -1));
    }

  }
  onCancel() {
    console.log("cancel");
    // this.findAll();
    this.Subscription = this.afd.list('/Students').subscribe(data => {
      this.properties = data;
      this.tempProperties = data;
      console.log(this.tempProperties);
    });

  }

  findAll() {
    this.Subscription = this.afd.list('/Students').subscribe(data => {
      this.properties = data;
      this.tempProperties = data;
      console.log(this.tempProperties);
    });

  }
  cancelHelp() {
    return Promise.resolve(this.afd.list('/Students').subscribe(data => {
      this.properties = data;
      console.log(this.properties);
    }));
  }
  showMap() { }



  register() {
    try{ 
    let id = this.genarateUniqueId();
          this.noteListRef = this.db.object('Students/'+id+"/");
          this.noteListRef.set(
            {
              "id": id,
              "name": this.name,
              "email": this.email,
              "course": this.course,
              "phonenumber": this.phonenumber,
              "currentYear": this.currnetYear,
              "batch": this.batch,
              "picture": "https://cdn1.iconfinder.com/data/icons/education-1-15/151/26-512.png"
            }

          );
          this.showAlert();
          console.log(id  );
        }catch(e){
          this.ErrorshowAlert(e.message);
          console.error(e.message);
        }
  }
  genarateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  ErrorshowAlert(message:string) {
    let alert = this.alertCtrl.create({
      title: '<strong style="color: red">Registation failed!<strong>',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Registerd Successfully!',
      subTitle: 'Student registation was successfuly done with <strong style="color: orange"> Smart Class</strong>',
      buttons: ['OK']
    });
    alert.present();
  }
  allocation(property: any){
    this.navCtrl.push(PropertyDetailPage, property);

  


  }

}
