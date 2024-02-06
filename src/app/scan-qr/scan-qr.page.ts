import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import {} from 'ngx-scanner-qrcode';
import { NgIf, CommonModule } from '@angular/common';
import {
  NgxScannerQrcodeModule,
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeService,
  NgxScannerQrcodeComponent,
  ScannerQRCodeSelectedFiles,
} from 'ngx-scanner-qrcode';
import { SafePipe } from '../safe.pipe';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-scan-qr',
  templateUrl: 'scan-qr.page.html',
  styleUrls: ['scan-qr.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonHeader,
    IonIcon,
    IonToolbar,
    IonTitle,
    IonContent,
    NgIf,
    SafePipe,
    NgxScannerQrcodeModule,
    CommonModule,
  ],
  providers: [ModalController],
})
export class ScanQRPage implements AfterViewInit {
  @ViewChild(NgxScannerQrcodeComponent) scanner!: NgxScannerQrcodeComponent;

  public e: ScannerQRCodeResult[] = [];
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
    isBeep: false,
  };

  public QRValue: string = '';

  constructor(private modalCtrl: ModalController) {
    console.log('config', this.config);
  }

  ngAfterViewInit(): void {
    this.scanner.isReady.subscribe((res) => {
      console.log('scanner isReady', res);
      this.handle(this.scanner, 'start');
    });

    this.scanner.devices.subscribe((res) => {
      console.log('devices', res);
    });
  }

  public close(): void {
    this.modalCtrl.dismiss({
      result: this.QRValue,
    });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();
    console.log(e[0].value);
    this.QRValue = e[0].value;
    if (this.QRValue && action) action.stop();
  }

  public handle(action: any, fn: string): void {
    console.log('action 1', action);
    console.log('fn', fn);
    const playDeviceFacingBack = (devices: any[]) => {
      console.log(devices);
      // front camera or back camera check here!
      const device = devices.find((f) =>
        /back|rear|environment/gi.test(f.label)
      ); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => console.log(fn, r),
        alert
      );
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }
}
