import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonModal,
} from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
import { NgIf, CommonModule } from '@angular/common';
import {
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';

import { SafePipe } from '../safe.pipe';

import { ScanQRPage } from '../scan-qr/scan-qr.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    ExploreContainerComponent,
    NgIf,
    SafePipe,
    NgxScannerQrcodeModule,
    CommonModule,
    IonicModule,
    ScanQRPage,
  ],
})
export class Tab2Page {
  public QRValue: string = '';
  
  constructor(private modalCtrl: ModalController) {}

  public async scanQRCode() {
    console.log('Scanning QR code.');
    await this.modalCtrl.create({ component: ScanQRPage }).then((modal) => {
      console.log('Modal Controller :', modal);
      modal.present();
      modal.onDidDismiss().then((result) => {
        this.QRValue = result.data.result;
        console.log('result', result);
        console.log('result', this.QRValue);
      });
    });
  }
}
