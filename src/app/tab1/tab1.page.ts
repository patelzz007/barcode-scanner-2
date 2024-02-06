import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
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

// Necessary to solve the problem of losing internet connection
LOAD_WASM().subscribe();

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    NgIf,
    SafePipe,
    NgxScannerQrcodeModule,
    CommonModule,
  ],
})
export class Tab1Page implements AfterViewInit {
  // For stackblitz reference : https://stackblitz.com/edit/angular-ngx-scanner-qrcode?file=src%2Fapp%2Fapp.component.ts,src%2Fapp%2Fapp.component.html,src%2Findex.html
  // npmjs : https://www.npmjs.com/package/ngx-scanner-qrcode?activeTab=readme
  // GitHub : https://github.com/id1945/ngx-scanner-qrcode-single

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#front_and_back_camera
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
    isBeep: false,
    // canvasStyles: [
    //   { /* layer */
    //     lineWidth: 1,
    //     fillStyle: '#00950685',
    //     strokeStyle: '#00950685',
    //   },
    //   { /* text */
    //     font: '17px serif',
    //     fillStyle: '#ff0000',
    //     strokeStyle: '#ff0000',
    //   }
    // ],
  };

  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  public percentage = 80;
  public quality = 100;

  public QRValue: string = '';

  constructor(private qrcode: NgxScannerQrcodeService) {}

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
      console.log('action isReady', res);
      // this.handle(this.action, 'start');
    });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();
    console.log(e[0].value);
    this.QRValue = e[0].value;
    if (this.QRValue && action) action.stop();
  }

  public handle(action: any, fn: string): void {
    console.log('111', action);
    console.log('222', fn);
    const playDeviceFacingBack = (devices: any[]) => {
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

  public onDowload(action: NgxScannerQrcodeComponent) {
    action.download().subscribe(console.log, alert);
  }

  public onSelects(files: any) {
    this.qrcode
      .loadFiles(files, this.percentage, this.quality)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        this.qrCodeResult = res;
      });
  }

  public onSelects2(files: any) {
    this.qrcode
      .loadFilesToScan(files, this.config, this.percentage, this.quality)
      .subscribe((res: ScannerQRCodeSelectedFiles[]) => {
        console.log(res);
        this.qrCodeResult2 = res;
      });
  }

  public onGetConstraints() {
    const constrains = this.action.getConstraints();
    console.log(constrains);
  }

  public applyConstraints() {
    const constrains = this.action.applyConstraints({
      ...this.action.getConstraints(),
      width: 510,
    });
    console.log(constrains);
  }
}
