import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { PropertyService } from '../../app/providers/property-service-mock';

/**
 * Generated class for the EditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
  email:string='';
  properties:any[];
  user ={} as User;
  property:any[]=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private afd: AngularFireDatabase) {
    this.property = this.navParams.data;
    console.log(this.property);
  //  this.afd.list('/Workers/asd').subscribe(data => {
  //     // this.email=this.service.tempWorkerId
  //     this.properties = data;
  //   for(let item of this.properties){
  //     console.log(item);
  //     if(item.email==this.email){
  //       this.user = item;
  //     }
  //   }
     
  //   });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }

}
